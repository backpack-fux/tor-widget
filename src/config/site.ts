export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Transactional On-ramps",
  description: "Make buying great again",
  navItems: [
    {
      label: "Details",
      href: "/details",
    },
    {
      label: "Payment",
      href: "/payment",
    },
  ],
  navMenuItems: [
    {
      label: "Details",
      href: "/details",
    },
    {
      label: "Payment",
      href: "/payment",
    },
  ],
  links: {
    home: "/",
    details: "/details",
    payment: "/payment",
  },
};
