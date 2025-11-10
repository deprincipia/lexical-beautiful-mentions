var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMentionLookupService } from "./useMentionLookupService";
const items = {
    "@": ["Jane"],
    "\\w+:": ["today", "tomorrow"],
};
const queryFn = (trigger, queryString) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, 100));
    const mentions = Object.entries(items).find(([key]) => {
        return new RegExp(key).test(trigger);
    });
    return mentions
        ? mentions[1].filter((m) => queryString ? m.toLowerCase().startsWith(queryString.toLowerCase()) : m)
        : [];
});
describe("useMentionLookupService", () => {
    it("should return the full list of mentions when the search term is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const { result } = renderHook(() => useMentionLookupService({
            queryString: "",
            trigger: "due:",
            items: items,
        }));
        yield waitFor(() => {
            expect(result.current.results).toStrictEqual(["today", "tomorrow"]);
        });
    }));
    it("should return the full list of mentions when the search term is null", () => __awaiter(void 0, void 0, void 0, function* () {
        const { result } = renderHook(() => useMentionLookupService({
            queryString: null,
            trigger: "due:",
            items: items,
        }));
        yield waitFor(() => {
            expect(result.current.results).toStrictEqual(["today", "tomorrow"]);
        });
    }));
    it("should return a filtered mention list for predefined items and search term", () => __awaiter(void 0, void 0, void 0, function* () {
        const { result } = renderHook(() => useMentionLookupService({
            queryString: "tomo",
            trigger: "due:",
            items: items,
        }));
        yield waitFor(() => {
            expect(result.current.results).toStrictEqual(["tomorrow"]);
        });
    }));
    it("should execute the mentions query function", () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            queryString: null,
            trigger: null,
            onSearch: queryFn,
            searchDelay: 100,
        };
        const { result, rerender } = renderHook((opt) => useMentionLookupService(opt), {
            initialProps: options,
        });
        expect(result.current.loading).toBe(false);
        expect(result.current.query).toBeNull();
        expect(result.current.results).toStrictEqual([]);
        rerender(Object.assign(Object.assign({}, options), { trigger: "due:", queryString: "tomor" }));
        yield waitFor(() => {
            expect(result.current.loading).toBe(true);
        }, { timeout: 200 });
        yield waitFor(() => {
            expect(result.current.query).toStrictEqual("tomor");
            expect(result.current.results).toStrictEqual(["tomorrow"]);
            expect(result.current.loading).toBe(false);
        });
    }));
    it("should return an empty array when no matching trigger was found", () => __awaiter(void 0, void 0, void 0, function* () {
        const { result } = renderHook(() => useMentionLookupService({
            queryString: "j",
            trigger: "#",
            items: items,
        }));
        yield waitFor(() => {
            expect(result.current.results).toStrictEqual([]);
        });
    }));
    it("should handle trigger change", () => __awaiter(void 0, void 0, void 0, function* () {
        const { result, rerender } = renderHook(({ queryString, trigger }) => useMentionLookupService({
            queryString: queryString,
            trigger: trigger,
            items: items,
        }), {
            initialProps: { queryString: "ja", trigger: "@" },
        });
        yield waitFor(() => {
            expect(result.current.results).toStrictEqual(["Jane"]);
        });
        rerender({ queryString: "ja", trigger: "due:" });
        yield waitFor(() => {
            expect(result.current.results).toEqual([]);
        });
    }));
});
