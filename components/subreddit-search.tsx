"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SubredditSearchProps {
  subreddit: string;
  onSubredditChange: (value: string) => void;
  onSearch: () => void;
}

export function SubredditSearch({ 
  subreddit, 
  onSubredditChange, 
  onSearch 
}: SubredditSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reddit Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Enter subreddit name"
              value={subreddit}
              onChange={(e) => onSubredditChange(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button type="submit">Load Subreddit</Button>
        </form>
      </CardContent>
    </Card>
  );
}