
const services = [
  {
    title: "Get Started With Your Free Trial",
    description: "Libero nunc facilisis auctor diam suspendisse pharetra nisi. Mauris ornare imperdiet.",
    icon: null,
    highlight: true,
    action: "Get Started Today"
  },
  {
    title: "Spa Area",
    description: "Libero nunc facilisis auctor diam suspendisse pharetra nisi. Mauris ornare imperdiet.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    highlight: false,
    action: "Learn More"
  },
  {
    title: "Changing Rooms",
    description: "Libero nunc facilisis auctor diam suspendisse pharetra nisi. Mauris ornare imperdiet.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    highlight: false,
    action: "Learn More"
  },
  {
    title: "Free Lessons",
    description: "Libero nunc facilisis auctor diam suspendisse pharetra nisi. Mauris ornare imperdiet.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    highlight: false,
    action: "Learn More"
  },
];

export default function Services() {
  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-primary mb-4">Our Services</h2>
        <p className="text-secondary uppercase tracking-widest text-sm">Sub Heading To Explain More</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div 
            key={index}
            className={`
              group rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300
              ${service.highlight 
                ? 'bg-primary text-white shadow-xl scale-105' 
                : 'bg-accent/30 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:scale-105'}
            `}
          >
            {service.icon && (
              <div className={`mb-6 transition-colors ${service.highlight ? 'text-white' : 'text-primary group-hover:text-white'}`}>
                {service.icon}
              </div>
            )}
            
            <h3 className={`text-xl font-bold mb-4 transition-colors ${!service.icon ? 'mt-8' : ''} ${service.highlight ? '' : 'group-hover:text-white'}`}>
              {service.title}
            </h3>
            
            <p className={`text-sm mb-8 leading-relaxed transition-colors ${service.highlight ? 'text-white/80' : 'text-secondary group-hover:text-white/80'}`}>
              {service.description}
            </p>
            
            <button className={`
              mt-auto px-6 py-2 rounded-lg font-medium text-sm transition-colors border
              ${service.highlight 
                ? 'bg-white text-primary border-white hover:bg-gray-100' 
                : 'bg-transparent text-primary border-primary group-hover:bg-white group-hover:text-primary'}
            `}>
              {service.action}
            </button>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows (Visual only for now) */}
      <div className="flex justify-end gap-4 mt-12">
        <button className="p-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <button className="p-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
