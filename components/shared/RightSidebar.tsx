import { currentUser } from "@clerk/nextjs/server";
import { fetchPopularCommunities } from "@/lib/actions/community.actions";
import { fetchSuggestedUsers } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

export default async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const communities = await fetchPopularCommunities(5);
  const users = await fetchSuggestedUsers(user.id, 5);

  return (
    <section className="rightsidebar">
      {/* Communities Section */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
        <div className="mt-4 flex flex-col gap-4">
          {communities.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div className="flex flex-1 flex-col justify-start mt-8">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <div className="mt-4 flex flex-col gap-4">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper components
const CommunityCard = ({ community }: any) => (
  <Link href={`/communities/${community._id}`}>
    <div className="flex items-center gap-3">
      <Image
        src={community.image || "/assets/community.svg"}
        alt={community.name}
        width={24}
        height={24}
        className="rounded-full"
      />
      <div>
        <p className="text-small-medium text-light-1">{community.name}</p>
        <p className="text-subtle-medium text-gray-1">
          {community.members.length} members
        </p>
      </div>
    </div>
  </Link>
);

const UserCard = ({ user }: any) => (
  <Link href={`/profile/${user.id}`}>
    <div className="flex items-center gap-3">
      <Image
        src={user.image}
        alt={user.name}
        width={24}
        height={24}
        className="rounded-full"
      />
      <div>
        <p className="text-small-medium text-light-1">{user.name}</p>
        <p className="text-subtle-medium text-gray-1">@{user.username}</p>
      </div>
    </div>
  </Link>
);