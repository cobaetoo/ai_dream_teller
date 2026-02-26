"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function AdminUserListPage() {
  const [filterType, setFilterType] = useState<"ALL" | "USER" | "GUEST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?type=${filterType.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  }, [filterType]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = String(user.identifier)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
}
