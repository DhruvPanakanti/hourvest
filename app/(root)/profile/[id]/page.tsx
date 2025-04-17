import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser, fetchUserPosts, fetchUserReplies } from "@/lib/actions/user.actions";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(resolvedParams.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  
  // Fetch user posts to get thread count
  const userPosts = await fetchUserPosts(resolvedParams.id);
  const threadCount = userPosts?.threads?.length || 0;
  
  // Fetch replies to get an accurate count
  const repliesData = await fetchUserReplies(userInfo.id);
  const replyCount = repliesData?.replies?.length || 0;

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {threadCount}
                  </p>
                )}
                {tab.label === "Replies" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {replyCount}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              {tab.value === "threads" ? (
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              ) : tab.value === "replies" ? (
                <></>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;