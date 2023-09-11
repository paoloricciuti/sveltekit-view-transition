/**
 * Fake Instagram Data
 */

import { faker } from '@faker-js/faker';

// Fake user data
export interface User {
	id: number;
	username: string;
	full_name: string;
	profile_picture_url: string;
}

// Fake photo data
export interface Photo {
	id: number;
	image_url: string;
	description: string;
	likes: number;
	user: User;
}

// Fake comment data
export interface Comment {
	id: number;
	user: User;
	text: string;
	photo_id: number;
}

// Fake story data
export interface Story {
	id: number;
	user: User;
	image_url: string;
}

// Generate fake user data
const generateUsers = (count: number): User[] => {
	const users: User[] = [];
	for (let i = 1; i <= count; i++) {
		const sex = faker.datatype.boolean() ? 'female' : 'male';
		users.push({
			id: i,
			username: faker.internet.userName(),
			full_name: faker.person.fullName({
				sex
			}),
			profile_picture_url: `https://randomuser.me/api/portraits/${
				sex === 'female' ? 'women' : 'men'
			}/${i}.jpg`
		});
	}
	return users;
};

// Generate fake photos
const generatePhotos = (count: number): Photo[] => {
	const photos: Photo[] = [];
	for (let i = 1; i <= count; i++) {
		const randomUserId = faker.number.int({ min: 1, max: users.length });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const user = users.find((user) => user.id === randomUserId)!;
		photos.push({
			id: i,
			image_url: `https://unsplash.it/500/500?image=${i + 30}`,
			description: faker.lorem.sentence(),
			likes: faker.number.int(1000),
			user
		});
	}
	return photos;
};

// Generate fake comments
const generateComments = (count: number, users: User[]): Comment[] => {
	const comments: Comment[] = [];
	for (let i = 1; i <= count; i++) {
		const randomUserId = faker.number.int({ min: 1, max: users.length });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const user = users.find((user) => user.id === randomUserId)!;
		const randomPhotoId = faker.number.int({ min: 1, max: photos.length });
		comments.push({
			id: i,
			user,
			text: faker.lorem.sentence(),
			photo_id: randomPhotoId
		});
	}
	return comments;
};

// Generate fake stories
const generateStories = (count: number, users: User[]) => {
	const stories: Story[] = [];
	for (let i = 1; i <= count; i++) {
		const randomUserId = faker.number.int({ min: 1, max: users.length });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const user = users.find((user) => user.id === randomUserId)!;
		stories.push({
			id: i,
			user,
			image_url: `https://unsplash.it/400/800?image=${i}`
		});
	}
	const stories_map: Record<string, Array<Story>> = {};
	for (const story of stories) {
		if (!stories_map[story.user.id]) {
			stories_map[story.user.id] = [];
		}
		stories_map[story.user.id].push(story);
	}
	return stories_map;
};

// Generate 10 fake users
const users = generateUsers(20);

// Generate 50 fake photos
const photos = generatePhotos(50);

// Generate 100 fake comments
const comments = generateComments(100, users);

// Generate 20 fake stories
const stories = generateStories(100, users);

// Export the fake data
export { users, photos, comments, stories };
