import {
	getAllBrandEvents,
	getAllEventsMonths,
	getAllHomeEvents,
	getAllNewsMonths,
	getAllVideosMonths,
	getBrandEventById,
	getBrandEventNews,
	getBrandEventNewsById,
	getBrandEventNewsVideoById,
	getBrandEventNewsVideos,
	getBrandEventPhotos,
	getCultureById,
	getCultures,
	getEventById,
	getEventChronology,
	getEventPhotos,
	getEventProgramById,
	getEventsByBrands,
	getEventsCategories,
	getEventsMonths,
	getHomeFaq,
	getHomeNews,
	getHomeObjects,
	getHomePartners,
	getHomePosters,
	getHomeVideos,
	getNewsById,
	getNewsCategories,
	getNewsMonths,
	getNewsVideos,
	getObjectById,
	getObjectEvents,
	getObjectNews,
	getObjectNewsById,
	getObjectNewsVideoById,
	getObjectNewsVideos,
	getObjectPhotos,
	getObjects,
	getObjectsInfo,
	getProjectById,
	getProjects,
	getVideoById,
	getVideosCategories,
	getVideosMonths,
} from '../controllers/main-controller.mjs'
import { Router } from 'express'

export const router = new Router()

router.get('/objects-info', getObjectsInfo)
router.get('/objects', getObjects)
router.get('/objects/:id', getObjectById)
router.get('/objects/:code/events', getObjectEvents)
router.get('/objects/:code/photos', getObjectPhotos)
router.get('/objects/:code/news', getObjectNews)
router.get('/objects/:code/news-videos', getObjectNewsVideos)
router.get('/objects/:code/news/:newsId', getObjectNewsById)
router.get('/objects/:code/news-videos/:videoId', getObjectNewsVideoById)
router.get('/projects', getProjects)
router.get('/projects/:id', getProjectById)
router.get('/news-months', getNewsMonths)
router.get('/all-news', getAllNewsMonths)
router.get('/news-categories', getNewsCategories)
router.get('/news/:id', getNewsById)
router.get('/news-videos', getNewsVideos)
router.get('/events-months', getEventsMonths)
router.get('/all-events', getAllEventsMonths)
router.get('/events-categories', getEventsCategories)
router.get('/events/:id', getEventById)
router.get('/events/:id/chronology', getEventChronology)
router.get('/events/:id/photos', getEventPhotos)
router.get('/events/:id/program/:dayId', getEventProgramById)
router.get('/videos-months', getVideosMonths)
router.get('/all-videos', getAllVideosMonths)
router.get('/videos-categories', getVideosCategories)
router.get('/videos/:id', getVideoById)
router.get('/brand-events', getAllBrandEvents)
router.get('/brand-events/:id', getBrandEventById)
router.get('/brand-events/:id/news', getBrandEventNews)
router.get('/brand-events/:id/news-videos', getBrandEventNewsVideos)
router.get('/brand-events/:id/news/:newsId', getBrandEventNewsById)
router.get('/brand-events/:id/news-videos/:videoId', getBrandEventNewsVideoById)
router.get('/brand-events/:id/events', getEventsByBrands)
router.get('/brand-events/:id/photos', getBrandEventPhotos)
router.get('/home/posters', getHomePosters)
router.get('/home/all-events', getAllHomeEvents)
router.get('/home/all-news', getHomeNews)
router.get('/home/all-videos', getHomeVideos)
router.get('/home/partners', getHomePartners)
router.get('/home/objects', getHomeObjects)
router.get('/home/faq', getHomeFaq)
router.get('/cultures', getCultures)
router.get('/cultures/:id', getCultureById)
