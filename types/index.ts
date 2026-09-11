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

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type TourListFilters = {
  page?: number;
  tag?: string;
  completion?: "completed" | "incomplete";
  maxSpots?: number;
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
    ranking?: number | null;
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
  provider?: string;
  account_deletion_auth_method: AccountDeletionAuthMethod;
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

export type AccountDeletionAuthMethod = "password" | "google" | "apple";

export type AccountDeletionPayload =
  | { method: "password"; password: string }
  | { method: "google"; id_token: string }
  | {
      method: "apple";
      identity_token: string;
      authorization_code: string;
      apple_user: string;
    };

export type AccountDeletionResponse = {
  request_id: string;
  status: "pending";
  deletion_scheduled_for: string;
  deadline_at: string;
  apple_revocation_status: "not_applicable" | "revoked" | "manual_required";
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

export type RankingApiResponse = {
  id: number;
  username: string;
  experience: number;
  character: string;
  position: number;
  display_name: string;
  is_blocked: boolean;
  name_hidden: boolean;
};

export type PaginatedRankingResponse = PaginatedResponse<RankingApiResponse> & {
  current_user: RankingApiResponse | null;
};

export type BlockedRankingUserApiResponse = {
  id: number;
  username: string;
  display_name: string | null;
  character: string | null;
  blocked_at: string;
};

export type QRCodeRedemptionApiResponse = {
  guid: string;
  reward_type: "coins" | "gems";
  reward_amount: number;
  redeemed_at: string;
  coins: number;
  gems: number;
};

export type RemainingAnswersApiResponse = {
  id: number;
  name: string;
};

export type PowerUp5050ApiResponse = {
  remaining_answers: RemainingAnswersApiResponse[];
  coins_remaining: number;
  coins_spent: string;
};
