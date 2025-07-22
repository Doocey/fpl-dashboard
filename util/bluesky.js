import { AtpAgent, RichText } from "@atproto/api";

export async function blueskyPost(posts) {
  try {
    const agent = new AtpAgent({
      service: "https://bsky.social"
    });

    await agent.login({
      identifier: process.env.BLUESKY_USERNAME,
      password: process.env.BLUESKY_PASSWORD
    });

    let rootPost = null;
    let parentPost = null;
    let lastResponse = null;

    for (let i = 0; i < posts.length; i++) {
      const richText = new RichText({ text: posts[i] });
      await richText.detectFacets(agent);

      const postData = {
        $type: "app.bsky.feed.post",
        text: richText.text,
        facets: richText.facets,
        createdAt: new Date().toISOString(),
        ...(parentPost && {
          reply: {
            root: { uri: rootPost.uri, cid: rootPost.cid },
            parent: { uri: parentPost.uri, cid: parentPost.cid }
          }
        })
      };

      lastResponse = await agent.post(postData);

      if (i === 0) rootPost = lastResponse;
      parentPost = lastResponse;
    }

    return lastResponse;
  } catch (error) {
    console.error("Bluesky posting failed:", error);
    return error;
  }
}
