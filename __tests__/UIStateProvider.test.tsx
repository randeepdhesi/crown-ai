import { renderHook, act } from "@testing-library/react";
import { UIStateProvider, useUIState } from "@/components/UIStateProvider";

describe("UIStateProvider", () => {
  it("provides null openSheet and 'All Inventory' source by default", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    expect(result.current.openSheet).toBeNull();
    expect(result.current.selectedSource).toBe("All Inventory");
  });

  it("updates openSheet to 'settings'", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("settings"); });
    expect(result.current.openSheet).toBe("settings");
  });

  it("updates openSheet to 'catalog'", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("catalog"); });
    expect(result.current.openSheet).toBe("catalog");
  });

  it("clears openSheet to null", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("settings"); });
    act(() => { result.current.setOpenSheet(null); });
    expect(result.current.openSheet).toBeNull();
  });

  it("updates selectedSource", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setSelectedSource("CGC Drywall"); });
    expect(result.current.selectedSource).toBe("CGC Drywall");
  });

  it("throws when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useUIState());
    }).toThrow("useUIState must be used within UIStateProvider");
    spy.mockRestore();
  });
});
