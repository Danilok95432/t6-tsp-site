import { objects, objectsInfo } from '../mockData/objects.mjs'
import { projects } from '../mockData/projects.mjs'
import { news, newsCategories, newsMonths } from '../mockData/news.mjs'
import { events, eventsCategories, eventsMonths } from '../mockData/events.mjs'
import { newsVideos, videosCategories, videosMonths } from '../mockData/newsVideos.mjs'
import { brandEvents } from '../mockData/brandEvents.mjs'
import {
	homeEvents,
	homeFaq,
	homeNews,
	homeObjects,
	homePartners,
	homePosters,
	homeVideos,
} from '../mockData/home.mjs'
import { cultures } from '../mockData/cultures.mjs'

export const getObjectsInfo = (req, res) => {
	res.status(200).json(objectsInfo)
}

export const getObjects = (req, res) => {
	res.status(200).json(objects)
}

export const getObjectEvents = (req, res) => {
	const { q } = req.query
	const objectCode = req.params.code

	const foundObject = objects.find((object) => object.objectCode === objectCode)
	const filteredObjectEvents = foundObject.events.filter((item) =>
		item.title.toLowerCase().includes(q),
	)

	res.status(200).json(filteredObjectEvents)
}

export const getObjectPhotos = (req, res) => {
	const objectCode = req.params.code
	const foundObject = objects.find((object) => object.objectCode === objectCode)
	const objectPhotos = foundObject.photos
	res.status(200).json(objectPhotos)
}

export const getObjectById = (req, res) => {
	const objectId = req.params.id
	const foundObject = objects.find((object) => object.id === objectId)

	res.status(200).json(foundObject)
}

export const getObjectNews = (req, res) => {
	const objectCode = req.params.code
	const { q, y } = req.query
	const searchedObject = objects.find((object) => object.objectCode === objectCode)
	const filteredNews = searchedObject.news.filter((el) => {
		if (y) {
			return String(new Date(el.date).getFullYear()) === y && el.title.toLowerCase().includes(q)
		}
		return el.title.toLowerCase().includes(q)
	})

	res.status(200).json(filteredNews)
}

export const getObjectNewsVideos = (req, res) => {
	const objectCode = req.params.code
	const searchedObject = objects.find((object) => object.objectCode === objectCode)
	res.status(200).json(searchedObject.newsVideos)
}

export const getObjectNewsVideoById = (req, res) => {
	const objectCode = req.params.code
	const videoId = req.params.videoId
	const searchedObject = objects.find((object) => object.objectCode === objectCode)
	const foundVideoNews = searchedObject.newsVideos.find((videoItem) => videoItem.id === videoId)

	res.status(200).json(foundVideoNews)
}

export const getObjectNewsById = (req, res) => {
	const objectCode = req.params.code
	const newsId = req.params.newsId
	const searchedObject = objects.find((object) => object.objectCode === objectCode)

	const foundNews = searchedObject.news.find((newsItem) => newsItem.id === newsId)

	res.status(200).json(foundNews)
}

export const getProjects = (req, res) => {
	const { q } = req.query

	const filteredProjects = projects.filter((el) => el.title.toLowerCase().includes(q))

	res.status(200).json(filteredProjects)
}

export const getProjectById = (req, res) => {
	const projectId = req.params.id
	const foundProject = projects.find((project) => project.id === projectId)

	res.status(200).json(foundProject)
}

export const getAllNewsMonths = (req, res) => {
	res.status(200).json(newsMonths)
}

export const getNewsMonths = (req, res) => {
	const { d, cat } = req.query
	let currentNews = []
	if (d === '0') {
		currentNews = Object.values(newsMonths).flat()
	} else {
		currentNews = newsMonths[d] ?? []
	}

	const filteredNews = currentNews.filter((news) => cat === '0' || news.category.id === cat)

	res.status(200).json(filteredNews)
}

export const getNewsCategories = (req, res) => {
	res.status(200).json(newsCategories)
}

export const getNewsVideos = (req, res) => {
	res.status(200).json(newsVideos)
}
export const getNewsById = (req, res) => {
	const newsId = req.params.id
	const foundNews = news.find((newsItem) => newsItem.id === newsId)

	res.status(200).json(foundNews)
}

export const getVideoById = (req, res) => {
	const newsId = req.params.id
	const foundVideoNews = newsVideos.find((newsItem) => newsItem.id === newsId)

	res.status(200).json(foundVideoNews)
}

export const getAllBrandEvents = (req, res) => {
	res.status(200).json(brandEvents)
}
export const getBrandEventById = (req, res) => {
	const brandEventId = req.params.id
	const foundBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)

	res.status(200).json(foundBrandEvent)
}

export const getEventsByBrands = (req, res) => {
	const { q } = req.query
	const brandEventId = req.params.id

	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)
	const filteredEvents = searchedBrandEvent.events.filter((event) =>
		event.title.toLowerCase().includes(q),
	)

	res.status(200).json(filteredEvents)
}

export const getBrandEventPhotos = (req, res) => {
	const brandEventId = req.params.id

	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)

	res.status(200).json(searchedBrandEvent.photos)
}

export const getBrandEventNews = (req, res) => {
	const brandEventId = req.params.id
	const { q, y } = req.query
	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)
	const filteredNews = searchedBrandEvent.news.filter((el) => {
		if (y) {
			return String(new Date(el.date).getFullYear()) === y && el.title.toLowerCase().includes(q)
		}
		return el.title.toLowerCase().includes(q)
	})

	res.status(200).json(filteredNews)
}

export const getBrandEventNewsVideos = (req, res) => {
	const brandEventId = req.params.id
	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)
	res.status(200).json(searchedBrandEvent.newsVideos)
}

export const getBrandEventNewsVideoById = (req, res) => {
	const brandEventId = req.params.id
	const videoId = req.params.videoId
	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)
	const foundVideoNews = searchedBrandEvent.newsVideos.find((videoItem) => videoItem.id === videoId)

	res.status(200).json(foundVideoNews)
}

export const getBrandEventNewsById = (req, res) => {
	const brandEventId = req.params.id
	const newsId = req.params.newsId
	const searchedBrandEvent = brandEvents.find((brandEvent) => brandEvent.id === brandEventId)

	const foundNews = searchedBrandEvent.news.find((newsItem) => newsItem.id === newsId)

	res.status(200).json(foundNews)
}

export const getAllEventsMonths = (req, res) => {
	res.status(200).json(eventsMonths)
}

export const getEventsMonths = (req, res) => {
	const { d, cat } = req.query
	let currentEvents = []
	if (d === '0') {
		currentEvents = Object.values(eventsMonths).flat()
	} else {
		currentEvents = eventsMonths[d] ?? []
	}

	const filteredEvents = currentEvents.filter((event) => cat === '0' || event.category.id === cat)

	res.status(200).json(filteredEvents)
}

export const getEventsCategories = (req, res) => {
	res.status(200).json(eventsCategories)
}

export const getEventById = (req, res) => {
	const eventId = req.params.id
	const foundEvent = events.find((eventItem) => eventItem.id === eventId)

	res.status(200).json(foundEvent)
}

export const getEventPhotos = (req, res) => {
	const eventId = req.params.id

	const searchedEvent = events.find((event) => event.id === eventId)

	res.status(200).json(searchedEvent.photos)
}
export const getEventChronology = (req, res) => {
	const eventId = req.params.id

	const searchedEvent = events.find((event) => event.id === eventId)

	res.status(200).json(searchedEvent.chronology)
}

export const getEventProgramById = (req, res) => {
	const eventId = req.params.id
	const dayId = req.params.dayId
	const searchedEvent = events.find((event) => event.id === eventId)
	const searchedProgramList = searchedEvent.program.find((programEl) => programEl.id === dayId)
	res.status(200).json(searchedProgramList.programList)
}

export const getAllVideosMonths = (req, res) => {
	res.status(200).json(videosMonths)
}

export const getVideosMonths = (req, res) => {
	const { d, cat } = req.query
	let currentVideos = []
	if (d === '0') {
		currentVideos = Object.values(videosMonths).flat()
	} else {
		currentVideos = videosMonths[d] ?? []
	}

	const filteredVideos = currentVideos.filter((video) => cat === '0' || video.category.id === cat)

	res.status(200).json(filteredVideos)
}

export const getVideosCategories = (req, res) => {
	res.status(200).json(videosCategories)
}

export const getHomePosters = (req, res) => {
	res.status(200).json(homePosters)
}

export const getHomeNews = (req, res) => {
	res.status(200).json(homeNews)
}
export const getHomeVideos = (req, res) => {
	res.status(200).json(homeVideos)
}
export const getHomePartners = (req, res) => {
	res.status(200).json(homePartners)
}
export const getAllHomeEvents = (req, res) => {
	res.status(200).json(homeEvents)
}
export const getHomeObjects = (req, res) => {
	res.status(200).json(homeObjects)
}

export const getHomeFaq = (req, res) => {
	res.status(200).json(homeFaq)
}
export const getCultures = (req, res) => {
	res.status(200).json(cultures)
}
export const getCultureById = (req, res) => {
	const cultureId = req.params.id
	const searchedCulture = cultures.find((culture) => culture.id === cultureId)
	res.status(200).json(searchedCulture)
}
