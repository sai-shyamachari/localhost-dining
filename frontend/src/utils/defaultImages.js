export const DEFAULT_RESTAURANT_IMAGES = {
  default:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  italian:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  japanese:
    "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80",
  indian:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  french:
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
  asian:
    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
  cafe:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
};

/**
 * Returns either the restaurant's uploaded images or a cuisine-matched default image
 * @param {Object} restaurant
 * @returns {Array<String>}
 */
export const getRestaurantImagesWithFallback = (restaurant) => {
  if (restaurant?.images && Array.isArray(restaurant.images) && restaurant.images.length > 0) {
    return restaurant.images;
  }

  const cuisines = (restaurant?.cuisine || []).map((c) => c.toLowerCase());

  if (cuisines.some((c) => c.includes("indian") || c.includes("desi") || c.includes("thali"))) {
    return [DEFAULT_RESTAURANT_IMAGES.indian];
  }
  if (cuisines.some((c) => c.includes("italian") || c.includes("pizza") || c.includes("pasta"))) {
    return [DEFAULT_RESTAURANT_IMAGES.italian];
  }
  if (cuisines.some((c) => c.includes("japanese") || c.includes("sushi") || c.includes("ramen"))) {
    return [DEFAULT_RESTAURANT_IMAGES.japanese];
  }
  if (cuisines.some((c) => c.includes("french") || c.includes("bistro"))) {
    return [DEFAULT_RESTAURANT_IMAGES.french];
  }
  if (cuisines.some((c) => c.includes("asian"))) {
    return [DEFAULT_RESTAURANT_IMAGES.asian];
  }

  return [DEFAULT_RESTAURANT_IMAGES.default];
};
