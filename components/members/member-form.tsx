"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useBoardStore } from "@/store/board-store";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function MemberForm() {
  const addMember = useBoardStore((state) => state.addMember);
  const [rawInput, setRawInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const names = rawInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (names.length === 0) {
      toast.error("Vui lòng nhập tên thành viên.");
      return;
    }

    let added = 0;
    const errors: string[] = [];

    for (const name of names) {
      const result = addMember(name);
      if (result.ok) {
        added++;
      } else {
        errors.push(`${name}: ${result.error}`);
      }
    }

    if (errors.length > 0) {
      toast.error(errors.length === 1 ? errors[0] : `${errors.length} lỗi: ${errors[0]}…`);
    }

    if (added > 0) {
      toast.success(`Đã thêm ${added} thành viên.`);
    }

    setRawInput("");
  }

  return (
    <form className="space-y-2 sm:space-y-3" onSubmit={handleSubmit}>
      <label className="block text-xs font-medium text-slate-700 sm:text-sm" htmlFor="member-name">
        Thêm thành viên
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="member-name"
          onChange={(event) => setRawInput(event.target.value)}
          placeholder="Nhập tên, phân cách bằng dấu phẩy"
          value={rawInput}
        />
        <Button className="sm:min-w-36" type="submit">
          <Plus className="mr-2 size-4" /> Thêm
        </Button>
      </div>
      <p className="text-[10px] text-slate-500 sm:text-sm">
        Có thể nhập nhiều tên cùng lúc, ví dụ: An, Bình, Nam
      </p>
    </form>
  );
}
