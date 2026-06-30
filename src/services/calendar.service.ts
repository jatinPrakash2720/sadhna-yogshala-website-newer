/**
 * Yogshala LMS — Google Calendar Service
 * Creates, patches, and deletes calendar events with Google Meet links.
 */

import { randomUUID } from "crypto";
import type { calendar_v3 } from "googleapis";
import { getCalendarClient, getCalendarId } from "@/config/googleCalendar";
import { GOOGLE_CALENDAR } from "@/constants";

export interface CreateCalendarEventInput {
  title: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface CreateCalendarEventResult {
  googleEventId: string;
  meetingLink: string;
}

function formatDatePart(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildEventDateTime(
  scheduledDate: Date,
  time: string
): calendar_v3.Schema$EventDateTime {
  return {
    dateTime: `${formatDatePart(scheduledDate)}T${time}:00`,
    timeZone: GOOGLE_CALENDAR.TIMEZONE,
  };
}

function extractMeetingLink(event: calendar_v3.Schema$Event): string {
  if (event.hangoutLink) {
    return event.hangoutLink;
  }

  const meetEntry = event.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === "video"
  );

  return meetEntry?.uri ?? "";
}

export class CalendarService {
  /**
   * Create a Google Calendar event with an auto-generated Meet link.
   */
  static async createEventWithMeet(
    input: CreateCalendarEventInput
  ): Promise<CreateCalendarEventResult> {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: input.title,
        description: input.description,
        start: buildEventDateTime(input.scheduledDate, input.startTime),
        end: buildEventDateTime(input.scheduledDate, input.endTime),
        conferenceData: {
          createRequest: {
            requestId: `${GOOGLE_CALENDAR.MEET_REQUEST_ID_PREFIX}${randomUUID()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const event = response.data;
    if (!event.id) {
      throw new Error("Google Calendar did not return an event ID");
    }

    const meetingLink = extractMeetingLink(event);
    if (!meetingLink) {
      throw new Error("Google Calendar did not return a Meet link");
    }

    return {
      googleEventId: event.id,
      meetingLink,
    };
  }

  /**
   * Patch an existing Google Calendar event.
   */
  static async patchEvent(
    googleEventId: string,
    patch: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.patch({
      calendarId,
      eventId: googleEventId,
      sendUpdates: "none",
      requestBody: patch,
    });

    return response.data;
  }

  /**
   * Merge new attendee emails into an existing calendar event.
   */
  static async addAttendees(
    googleEventId: string,
    emails: string[]
  ): Promise<void> {
    if (emails.length === 0) {
      return;
    }

    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const existing = await calendar.events.get({
      calendarId,
      eventId: googleEventId,
    });

    const existingEmails = new Set(
      (existing.data.attendees ?? [])
        .map((attendee) => attendee.email?.toLowerCase())
        .filter((email): email is string => Boolean(email))
    );

    for (const email of emails) {
      existingEmails.add(email.toLowerCase());
    }

    await calendar.events.patch({
      calendarId,
      eventId: googleEventId,
      sendUpdates: "all",
      requestBody: {
        attendees: Array.from(existingEmails).map((email) => ({ email })),
      },
    });
  }

  /**
   * Delete a Google Calendar event.
   */
  static async deleteEvent(googleEventId: string): Promise<void> {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
      sendUpdates: "all",
    });
  }
}

export default CalendarService;
