import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon, XIcon } from "lucide-react";

/**
 * FilterDropdown component providing a custom styled dropdown matching the design system.
 * When not in use (unselected), it appears greyed out with placeholder styling.
 * When active, displays the selected label with an option to clear.
 */
export function FilterDropdown({
  placeholder,
  value,
  options,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = Boolean(selectedOption);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button - Greyed out when not in use */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-[6px] cursor-pointer select-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#F65F42]/30 focus-visible:outline-none ${
          hasValue
            ? "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 shadow-2xs"
            : "bg-[#F4F4F5] hover:bg-[#EBEBEF] dark:bg-neutral-800/90 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-transparent"
        }`}
      >
        <span>{hasValue ? selectedOption.label : placeholder}</span>

        {hasValue ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setIsOpen(false);
            }}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-0.5 transition-colors cursor-pointer"
            title="Clear filter"
          >
            <XIcon className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" />
          </span>
        ) : (
          <ChevronDownIcon
            className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-150 ease-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Styled Options Menu */}
      {isOpen && (
        <div
          style={{ transformOrigin: "top left" }}
          className="absolute left-0 mt-1.5 w-36 z-50 bg-white dark:bg-neutral-900 rounded-[8px] border border-neutral-200/80 dark:border-neutral-800 shadow-lg shadow-black/8 p-1 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  // Clicking the same option clears it, otherwise sets it
                  onChange(isSelected ? "" : option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-[6px] transition-[background-color,color] duration-150 cursor-pointer text-left ${
                  isSelected
                    ? "bg-[#F65F42]/10 text-[#F65F42] font-medium"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <CheckIcon className="w-4 h-4 text-[#F65F42]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

