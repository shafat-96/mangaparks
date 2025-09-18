export type PopularUpdatesParams = {
    init?: number;
    page?: number;
    size?: number;
};
export declare function getPopularUpdates(params?: PopularUpdatesParams): Promise<any>;
export type ChapterImagesResult = {
    totalImg: number;
    jpegUrls: string[];
};
export declare function fetchChapterImages(path: string): Promise<ChapterImagesResult>;
declare const _default: {
    getPopularUpdates: typeof getPopularUpdates;
    fetchChapterImages: typeof fetchChapterImages;
};
export default _default;
//# sourceMappingURL=index.d.ts.map