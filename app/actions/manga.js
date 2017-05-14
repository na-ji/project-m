export const LOAD_MANGA = 'LOAD_MANGA';
// export const REQUEST_CHAPTERS = 'REQUEST_CHAPTERS';
export const RECEIVE_CHAPTERS = 'RECEIVE_CHAPTERS';
// export const REQUEST_DETAILS = 'REQUEST_DETAILS';
export const RECEIVE_DETAILS = 'RECEIVE_DETAILS';
export const MANGA_TOGGLE_LIBRARY = 'MANGA_TOGGLE_LIBRARY';

import { TOGGLE_MANGA_TO_LIBRARY } from './library';

let mangaManager = require('../utils/manga-manager');

function loadManga (manga) {
    return {
        type: LOAD_MANGA,
        manga
    };
}

function receiveChapters (chapters) {
    return {
        type: RECEIVE_CHAPTERS,
        chapters
    };
}

function receiveDetails (manga) {
    return {
        type: RECEIVE_DETAILS,
        manga
    };
}

export function toggleLibrary () {
    return (dispatch, getState) => {
        dispatch({
            type: MANGA_TOGGLE_LIBRARY
        });

        const { manga } = getState().manga;

        dispatch({
            type: TOGGLE_MANGA_TO_LIBRARY,
            manga
        });
    };
}

function fetchInfos (manga) {
    return (dispatch) => {
        dispatch(loadManga(manga));

        if (!manga.chapters.length) {
            mangaManager.getChapterList(manga).then(function (chapters) {
                dispatch(receiveChapters(chapters));
            });
        } else {
            mangaManager.getMangaById(manga.id).then(function (response) {
                dispatch(receiveChapters(response.chapters));
            });
        }

        if (!manga.detail_fetched) {
            mangaManager.getMangaDetail(manga).then(function (manga) {
                console.log(manga);
                dispatch(receiveDetails(manga));
            });
        }
    };
}

export function fetchInfosIfNeeded (manga) {
    return (dispatch, getState) => {
        const oldManga = getState().manga.manga;

        if (oldManga.id !== manga.id) {
            dispatch(fetchInfos(manga));
        }
    };
}