"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User, Mail, Phone, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiResponse, IUser } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit number").optional().or(z.literal("")),
  bio: z.string().max(500, "Max 500 characters").optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  emergencyContact: z.string().max(200, "Max 200 characters").optional(),
  healthConditions: z.string().max(500, "Max 500 characters").optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type ProfileForm = z.infer<typeof profileSchema>;
type SecurityForm = z.infer<typeof securitySchema>;

function ProfileTab({ user }: { user: IUser }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: user.name, 
      email: user.email, 
      phone: user.phone || "", 
      bio: user.bio || "",
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      gender: user.gender || "",
      emergencyContact: user.emergencyContact || "",
      healthConditions: user.healthConditions || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) => axios.post("/api/auth/update-profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  });

  const onSubmit = (data: ProfileForm) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Input id="settings-name" label="Full Name" leftIcon={<User className="h-4 w-4" />} error={errors.name?.message} {...register("name")} />
        <Input id="settings-email" type="email" label="Email" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register("email")} />
        <Input id="settings-phone" type="tel" label="Phone" leftIcon={<Phone className="h-4 w-4" />} error={errors.phone?.message} {...register("phone")} />
        <Input id="settings-dob" type="date" label="Date of Birth" error={errors.dob?.message} {...register("dob")} />
        <div>
          <label className="input-label">Gender</label>
          <select id="settings-gender" className="input-field" {...register("gender")}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>
        <Input id="settings-emergency" label="Emergency Contact" error={errors.emergencyContact?.message} {...register("emergencyContact")} />
      </div>

      <div>
        <label className="input-label">Health Conditions (if any)</label>
        <textarea
          id="settings-health"
          rows={2}
          className="input-field resize-none"
          placeholder="List any injuries, medical conditions, or allergies..."
          {...register("healthConditions")}
        />
        {errors.healthConditions && <p className="text-red-500 text-xs mt-1">{errors.healthConditions.message}</p>}
      </div>

      <div>
        <label className="input-label">Bio</label>
        <textarea
          id="settings-bio"
          rows={3}
          className="input-field resize-none"
          placeholder="A short bio about yourself..."
          {...register("bio")}
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" isLoading={mutation.isPending} id="settings-save-profile-btn">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        {saved && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-sm text-brand-600 font-medium">
            <CheckCircle className="h-4 w-4" /> Saved!
          </motion.span>
        )}
      </div>
    </form>
  );
}

function SecurityTab() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SecurityForm) => axios.post("/api/auth/change-password", {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
    onSuccess: () => {
      setSaved(true);
      setError(null);
      reset();
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to change password");
    }
  });

  const onSubmit = (data: SecurityForm) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
      <Input id="settings-current-password" type="password" label="Current Password" leftIcon={<Lock className="h-4 w-4" />} error={errors.currentPassword?.message} {...register("currentPassword")} />
      <Input id="settings-new-password" type="password" label="New Password" leftIcon={<Lock className="h-4 w-4" />} error={errors.newPassword?.message} {...register("newPassword")} />
      <Input id="settings-confirm-password" type="password" label="Confirm New Password" leftIcon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" isLoading={mutation.isPending} id="settings-change-password-btn">
          <Lock className="h-4 w-4" />
          Change Password
        </Button>
        {saved && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-sm text-brand-600 font-medium">
            <CheckCircle className="h-4 w-4" /> Updated!
          </motion.span>
        )}
      </div>
    </form>
  );
}

const TABS = ["Profile", "Security"] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Profile");

  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<{ user: IUser }>>("/api/auth/me");
      return res.data.data?.user;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load account settings. Please try again.</p>
      </div>
    );
  }

  const user = data;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Account Settings</h1>
        <p className="text-sage-500">Manage your profile and security preferences.</p>
      </div>

      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-5 mb-8">
        {user.image ? (
          <img src={user.image} alt={user.name} className="h-16 w-16 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-brand-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-sage-400">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} · Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        </div>
        <button id="settings-change-photo-btn" className="ml-auto text-sm text-brand-600 hover:underline font-medium">
          Change Photo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`settings-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab ? "bg-white text-brand-700 shadow-sm" : "text-sage-500 hover:text-sage-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === "Profile" ? <ProfileTab user={user} /> : <SecurityTab />}
      </div>
    </motion.div>
  );
}
