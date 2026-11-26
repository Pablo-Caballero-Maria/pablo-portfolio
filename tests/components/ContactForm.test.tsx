import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/home/ContactForm";

const message = "Hello Pablo, I'd like to talk about a research position in our lab.";

function setup() {
  const send = vi.fn<(href: string) => void>();
  render(<ContactForm to="me@example.org" send={send} />);
  return { send, user: userEvent.setup() };
}

describe("ContactForm", () => {
  it("shows what is missing instead of opening an empty e-mail", async () => {
    const { send, user } = setup();
    await user.click(screen.getByRole("button", { name: "Open in my e-mail app" }));
    expect(send).not.toHaveBeenCalled();
    const name = screen.getByRole("textbox", { name: /^Name/ });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Please tell me your name.");
    expect(screen.getByText("Please write at least a couple of sentences.")).toBeInTheDocument();
  });

  it("opens the e-mail app with the message ready", async () => {
    const { send, user } = setup();
    await user.type(screen.getByRole("textbox", { name: /^Name/ }), "Ada");
    await user.type(screen.getByRole("textbox", { name: /^Message/ }), message);
    expect(screen.getByText(`${message.length}/1500`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open in my e-mail app" }));
    expect(send).toHaveBeenCalledOnce();
    const href = send.mock.calls[0]![0];
    expect(href.startsWith("mailto:me@example.org?")).toBe(true);
    expect(new URLSearchParams(href.split("?")[1]).get("body")).toBe(`${message}\n\nAda`);
    expect(screen.getByRole("status")).toHaveTextContent("should now be open");
  });
});
