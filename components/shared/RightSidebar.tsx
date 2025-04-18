import { currentUser } from "@clerk/nextjs/server";
import { fetchCommunitiesByMemberCount } from "@/lib/actions/community.actions";
import { fetchSuggestedUsers } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const { communities } = await fetchCommunitiesByMemberCount({ limit: 5 });
  const { users } = await fetchSuggestedUsers({ userId: user.id, limit: 5 });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
        <div className="mt-4 flex flex-col gap-4">
          {communities.length === 0 ? (
            <p className="text-subtle-medium text-gray-1">No communities yet</p>
          ) : (
            <>
              {communities.map((community) => (
                <div key={community.id} className="flex flex-col gap-2">
                  <Link href={`/communities/${community.id}`}>
                    <div className="flex items-center gap-3">
                      <Image
                        src={community.image}
                        alt={typeof community.name === "string" ? community.name : "community image"}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      <p className="text-small-medium text-light-1">
                        {typeof community.name === "string" ? community.name : "Unnamed Community"}
                      </p>
                    </div>
                  </Link>
                  <p className="text-subtle-medium text-gray-1 ml-7">
                    {Array.isArray(community.members) ? community.members.length : 0} members
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start mt-8">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <div className="mt-4 flex flex-col gap-4">
          {users.length === 0 ? (
            <p className="text-subtle-medium text-gray-1">No users yet</p>
          ) : (
            <>
              {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-2">
                  <Link href={`/profile/${user.id}`}>
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image}
                        alt={user.name || "user profile image"}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-small-medium text-light-1">{user.name || "Unnamed User"}</p>
                        <p className="text-subtle-medium text-gray-1">@{user.username}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
