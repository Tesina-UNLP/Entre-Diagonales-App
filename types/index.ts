export type CharacterApiResponse = {
  id: number;
  name: string;
  description: string;
  image_url: string;
};

export type LevelApiResponse = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  xp_required: number;
};

export type TourApiResponse = {
  id: number;
  name: string; // minLength: 1, maxLength: 100
  description: string | null;
  tag: string | null; // maxLength: 50
  active: boolean;
  readonly spots: StopApiResponse[];
  readonly progress: string;
  readonly completed_at: string | null;
  readonly started: string;
  readonly number_of_people_completed: number;
};

export type TourInfoApiResponse = {
  id: number;
  name: string; // minLength: 1, maxLength: 100
  description: string | null;
  tag: string | null; // maxLength: 50
  active: boolean;
  readonly progress: string;
  readonly completed_at: string | null;
  readonly started: string;
  readonly number_of_people_completed: number;
  readonly spots: StopApiResponse[];
};

export type StopApiResponse = {
  order: number;
  spot: {
    activated: boolean;
    address: string;
    description: string | null;
    fun_facts: string;
    historical_information: string;
    id: number;
    image_urls: string[];
    latitude: number | null;
    longitude: number | null;
    name: string;
    schedule: string;
    secret_items: SecretItemApiResponse[];
    slug: string;
    tag: string | null;
    ticket_price: number | null;
    wheelchair_accessible: boolean;
  };
};

export type QuizAnswerApiResponse = {
  id: number;
  quiz: number;
  name: string;
};

export type QuizApiResponse = {
  id: number;
  name: string;
  explanation: string;
  actived: boolean;
  answers: QuizAnswerApiResponse[];
};

export type IndividualSpotApiResponse = {
  activated: boolean;
  address: string;
  description: string | null;
  fun_facts: string;
  historical_information: string;
  id: number;
  image_urls: string[];
  latitude: number | null;
  longitude: number | null;
  name: string;
  schedule: string;
  secret_items: SecretItemApiResponse[];
  slug: string;
  tag: string | null;
  ticket_price: number | null;
  wheelchair_accessible: boolean;
  quiz: QuizApiResponse | null;
  quiz_solved: boolean;
};

export type SecretItemApiResponse = {
  description: string;
  hint: string | null;
  id: number;
  image_url: string | null;
  is_active: boolean;
  name: string;
  obtained: boolean;
};

export type AppUser = {
  id: string;
  email: string;
  access: string;
  refresh: string;
  on_boarding_completed_at?: boolean;
  experience: number;
  gems: number;
  coins: number;
  notifications?: boolean; // Estado de las notificaciones push
  character?: {
    id: number;
    name: string;
    description: string;
    image_url: string;
  };
  level?: {
    id: number;
    name: string;
    description: string;
    xp_required: number;
    image_url: string;
  };
  display_name: string;
  username: string;
  next_level?: {
    id: number;
    name: string;
    description: string;
    xp_required: number;
    image_url: string;
  };
  total_tours_completed: number;
  total_secret_items_completed: number;
  total_quizzes_completed: number;
};

export type FeedbackApiData = {
  name: string;
  qualification: number;
  trivia_liked: boolean;
  spots_liked: boolean;
  secrets_liked: boolean;
  route_liked: boolean;
  rewards_liked: boolean;
  comment?: string | null;
};

export type AchievementApiResponse = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  multiplier: number;
  expired_at: string | null;
  goal: number;
  goal_type: string;
  is_active: boolean;
};

export type UserAchievementApiResponse = {
  id: number;
  achievement: AchievementApiResponse;
  progress: number;
  completed_at: string | null;
  is_completed: boolean;
  completion_percentage: string;
  experience_reward: number;
  gems_reward: number;
};
