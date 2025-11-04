"use client";

import StaggeredMenu from "@/components/StaggeredMenu";

export default function SiteMenu() {
  return (
    <StaggeredMenu
      position="right"
      items={[
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
        { label: 'Projects', ariaLabel: 'View projects', link: '/projects' }
      ]}
      projectItems={[
        { label: 'ROSH', link: '/projects/rosh' },
        { label: 'Paturain', link: '/projects/paturain' },
        { label: 'FIORI', link: '/projects/fiori' },
        { label: 'Quality Lodgings', link: '/projects/quality-lodgings' },
        { label: 'FIS', link: '/projects/fis' }
      ]}
      displaySocials={true}
      socialItems={[
        { label: 'Instagram', link: 'https://instagram.com' },
        { label: 'Facebook', link: 'https://facebook.com' }
      ]}
      displayItemNumbering={true}
      menuButtonColor="#fff"
      openMenuButtonColor="#fff"
      changeMenuColorOnOpen={true}
      colors={["#BF60DE", "#BF60DE"]}
      accentColor="#BF60DE"
      logoUrl={undefined}
      isFixed
    />
  );
}


