import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Education } from "@/components/home/education";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { References } from "@/components/home/references";
import { Skills } from "@/components/home/skills";
import { World } from "@/components/home/world";

/** The home page: the CV as one long page, section by section (see `navigation`). */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <World />
      <References />
      <Contact />
    </>
  );
}
