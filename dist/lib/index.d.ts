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
export type LatestReleasesParams = {
    genre?: string;
    genres_excs?: string[];
    genres_incs?: string[];
    init?: number;
    multi?: boolean;
    page?: number;
    size?: number;
};
export declare function getLatestReleases(params?: LatestReleasesParams): Promise<any>;
export type MemberUploadsParams = {
    init?: number;
    page?: number;
    size?: number;
};
export declare function getMemberUploads(params?: MemberUploadsParams): Promise<any>;
export declare function getRandomMangas(amount?: number): Promise<any>;
export declare function getYWeekList(): Promise<any>;
export declare function getMplistsWeekly(yweek: number, limit?: number): Promise<any>;
export declare function getMplistsNewlyAdded(params?: {
    comicId?: number | null;
    init?: number;
    page?: number;
    size?: number;
}): Promise<any>;
export declare function getMplistsMostLikes(params?: {
    comicId?: number | null;
    init?: number;
    page?: number;
    size?: number;
}): Promise<any>;
export declare function searchComics(params?: {
    page?: number;
    size?: number;
    sortby?: string;
    word?: string;
}): Promise<any>;
export type InfoType = {
    img: string | null;
    title: string | null;
    otherInfo: string[];
    search: string[];
    genres: string[];
    originalPulication: string | null;
    mParkUploadStatus: string | null;
    description: string | null;
};
export declare function getTitleInfo(id: string): Promise<InfoType>;
export type ChapterType = {
    id: string | null;
    chapter: string | null;
    uploaded: string | null;
};
export declare function getTitleChapters(id: string): Promise<ChapterType[]>;
declare const _default: {
    getPopularUpdates: typeof getPopularUpdates;
    fetchChapterImages: typeof fetchChapterImages;
    getLatestReleases: typeof getLatestReleases;
    getMemberUploads: typeof getMemberUploads;
    getRandomMangas: typeof getRandomMangas;
    getYWeekList: typeof getYWeekList;
    getMplistsWeekly: typeof getMplistsWeekly;
    getMplistsNewlyAdded: typeof getMplistsNewlyAdded;
    getMplistsMostLikes: typeof getMplistsMostLikes;
    searchComics: typeof searchComics;
    getTitleInfo: typeof getTitleInfo;
    getTitleChapters: typeof getTitleChapters;
};
export default _default;
//# sourceMappingURL=index.d.ts.map