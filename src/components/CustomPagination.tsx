"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CustomPagination({
  total,
  currPage,
  previous,
  next,
}: {
  total: number;
  currPage: number;
  previous: () => void;
  next: () => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={previous}
            className="bg-transparent hover:bg-white hover:text-black "
            disabled={currPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        </PaginationItem>
        <Button className="font-semibold">{currPage}</Button>
        <PaginationItem>
          <Button
            onClick={next}
            className="bg-transparent hover:bg-white hover:text-black"
            disabled={currPage === total}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
