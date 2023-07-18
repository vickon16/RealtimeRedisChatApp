type Command = "get" | "sismember" | "zrange" | "smembers";

// get - get members
// sismember - Determines whether a member belongs to a set.
// smembers - Returns all the members of the set value stored at key
// zrange - Returns the specified range of elements in the sorted set stored at <key>

export async function fetchRedis(command : Command, ...args : (string | number)[]) {
  const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL}/${command}/${args.join("/")}`;
  
  // commnadUrl might be like "https://example.upstash.io/get/user:idToAdd:incoming_friend_requests/currentUserId"

  const response = await fetch(commandUrl, {
    headers : {
      Authorization : `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    },
    cache : "no-store" // telling nextjs no to store cached data
  })

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }

  const {result} = await response.json();
  return result;
}