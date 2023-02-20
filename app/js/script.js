//Loading Animation
let animator = document.getElementById('loader');
let deiatls = document.getElementById('deiatls');

function hideLoader() {
  deiatls.style.display = 'none';
  setTimeout(function() {
    animator.style.display = 'none';
  }, 9997); // 9000 milliseconds = 9 seconds
};

function clickButton(){

  animator.style.display = 'block';
  hideLoader()

  setInterval(showVideoInfo, 9997);
}


// Load the YouTube API client library
gapi.load("client", initClient);

// Initialize the API client library
function initClient() {
  gapi.client.init({
    apiKey: "AIzaSyAT2xb_UwBEYKNF6OS1qTQ7kqFYgvY2oW0",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
  });
}

async function showVideoInfo() {

  try {
    // Get the input URL from the user
    const inputUrl = document.getElementById("youtube-url").value;

    // Define a regular expression to extract the video ID from the URL
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]+)/;

    // Use the regular expression to extract the video ID
    const match = inputUrl.match(regex);
    const videoId = match[1];

    // Call the YouTube Data API to get information about the video
    const videoResponse = await gapi.client.youtube.videos.list({
      part: "snippet,statistics",
      id: videoId
    });

    // Get the video information from the API response
    const video = videoResponse.result.items[0];

    // Get the URL of the video thumbnail from the API response
    const thumbnailUrl = video.snippet.thumbnails.maxres.url;

    // Set the `src` attribute of an `img` tag to display the thumbnail
    const img = document.createElement("img");
    img.src = thumbnailUrl;

    // Add the thumbnail to the page
    const thumbnailContainer = document.getElementById("thumbnail-container");
    thumbnailContainer.innerHTML = "";
    thumbnailContainer.appendChild(img);

    // Get the video information and display it on the page
    const videoTitle = video.snippet.title;
    const likeCount = video.statistics.likeCount;
    const viewCount = video.statistics.viewCount;
    const description = video.snippet.description;
    const channelName = video.snippet.channelTitle;

    const titleElement = document.getElementById("video-title");
    titleElement.innerText = videoTitle;

    const likeCountElement = document.getElementById("like-count");
    likeCountElement.innerText = `Likes: ${likeCount}`;

    const viewCountElement = document.getElementById("views-count");
    viewCountElement.innerText = `Views: ${viewCount}`;

    const descriptionElement = document.getElementById("description");
    descriptionElement.innerText = description;

    const channelNameElement = document.getElementById("channel-name");
    channelNameElement.innerText = `Channel: ${channelName}`;

    // Call the YouTube Data API to get the video's comments
    const commentResponse = await gapi.client.youtube.commentThreads.list({
      part: "snippet",
      videoId: videoId,
      order: "time",
      maxResults: 10
    });

    // Get the comments from the API response
    const comments = commentResponse.result.items;

    // Display the comments on the page
    const commentsContainer = document.getElementById("comments");
    commentsContainer.innerHTML = "";

    comments.forEach(comment => {
      const username = comment.snippet.topLevelComment.snippet.authorDisplayName;
      const commentText = comment.snippet.topLevelComment.snippet.textDisplay;

      const commentElement = document.createElement("div");
      commentElement.id = "one-comment";
      commentElement.innerHTML = `<p id="user">${username}</p><p id="comment">${commentText}</p>`;

      commentsContainer.appendChild(commentElement);
    });

    animator.style.display = 'none';
    deiatls.style.display = 'block';

  } catch (error) {
    console.error(error);
  }
}