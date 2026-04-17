import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "@/components/BottomSheet";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, className, "data-testid": dataTestId, ...props }: React.HTMLAttributes<HTMLDivElement> & { "data-testid"?: string }) => (
      <div onClick={onClick} className={className} data-testid={dataTestId} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("BottomSheet", () => {
  it("renders children when isOpen is true", () => {
    render(
      <BottomSheet isOpen={true} onClose={jest.fn()} heightClass="h-2/3">
        <span>Sheet content</span>
      </BottomSheet>
    );
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
  });

  it("does not render children when isOpen is false", () => {
    render(
      <BottomSheet isOpen={false} onClose={jest.fn()} heightClass="h-2/3">
        <span>Sheet content</span>
      </BottomSheet>
    );
    expect(screen.queryByText("Sheet content")).not.toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(
      <BottomSheet isOpen={true} onClose={onClose} heightClass="h-2/3">
        <span>Content</span>
      </BottomSheet>
    );
    fireEvent.click(screen.getByTestId("sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
