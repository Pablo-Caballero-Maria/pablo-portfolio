import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Education } from "@/components/home/Education";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { References } from "@/components/home/References";
import { Skills } from "@/components/home/Skills";
import { World } from "@/components/home/World";

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
