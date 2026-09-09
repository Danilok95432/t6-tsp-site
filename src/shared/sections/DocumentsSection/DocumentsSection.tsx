import { Link } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

type DocumentItem = {
	id: string
	title: string
	description: string
	fileName: string
	fileType: string
	fileSize: string
}

const documentsMock: DocumentItem[] = [
	{
		id: '1',
		title: 'Название документа для скачивания',
		description: 'Описание документа для скачивания на две-три строки',
		fileName: '/documents/document-1.pdf',
		fileType: 'PDF',
		fileSize: '150 КБ',
	},
	{
		id: '2',
		title: 'Название документа для скачивания',
		description: 'Описание документа для скачивания на две-три строки',
		fileName: '/documents/document-2.pdf',
		fileType: 'PDF',
		fileSize: '150 КБ',
	},
	{
		id: '3',
		title: 'Название документа для скачивания',
		description: 'Описание документа для скачивания на две-три строки',
		fileName: '/documents/document-3.pdf',
		fileType: 'PDF',
		fileSize: '150 КБ',
	},
]

const certificatesMock = {
	title: 'Сертификаты',
	description: 'Сертификат на разработку и производство оборудования Gate',
	link: '/certificates',
}

export const DocumentsSection = () => {
	return (
		<Section id='documents' className={styles.documents}>
			<Container>
				<div className={styles.header}>
					<h2 className={styles.title}>Документы</h2>

					<Link to='/documents' className={styles.allDocuments}>
						<span>Все документы</span>

						<svg width='6' height='10' viewBox='0 0 6 10' fill='none' aria-hidden='true'>
							<path
								d='M1 1L5 5L1 9'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</Link>
				</div>

				<div className={styles.grid}>
					{documentsMock.map((document) => (
						<article className={styles.documentCard} key={document.id}>
							<div className={styles.documentContent}>
								<h3 className={styles.documentTitle}>{document.title}</h3>

								<p className={styles.documentDescription}>{document.description}</p>
							</div>

							<a className={styles.downloadBtn} href={document.fileName} download>
								<span>Скачать</span>

								<span className={styles.fileInfo}>
									{document.fileType}, {document.fileSize}
								</span>
							</a>
						</article>
					))}

					<Link to={certificatesMock.link} className={styles.certificatesCard}>
						<div>
							<h3 className={styles.certificatesTitle}>{certificatesMock.title}</h3>

							<p className={styles.certificatesDescription}>{certificatesMock.description}</p>
						</div>

						<div className={styles.certificatesLink}>
							<span>Посмотреть сертификаты</span>

							<svg width='6' height='10' viewBox='0 0 6 10' fill='none' aria-hidden='true'>
								<path
									d='M1 1L5 5L1 9'
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
					</Link>
				</div>
			</Container>
		</Section>
	)
}
