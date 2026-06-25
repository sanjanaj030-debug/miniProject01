const screenMode = document.querySelector("[data-screenMode]")
const modeContainer = document.querySelector(".mode-container")
const modeIcon = document.querySelector("[data-modeIcon]")
const searchInput = document.querySelector("[data-searchInput]")
const searchBtn = document.querySelector("[data-searchBtn]")
const loadingScreen = document.querySelector(".loading-container")




let darkMode = false;

screenMode.innerText = "DARK";
modeIcon.src = "moon.png";

modeContainer.addEventListener("click", () => {

    darkMode = !darkMode;

    document.body.classList.toggle("dark-mode");

    if(darkMode){
        screenMode.innerText = "LIGHT";
        modeIcon.src = "sun.png";
    }
    else{
        screenMode.innerText = "DARK";
        modeIcon.src = "moon.png";
    }

});


function getUserName(){
   return searchInput.value.trim();
}

function handleSearch(){
   const username = getUserName();
   if(!username) return;

   fetchUserDetails(username);
}


searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown" ,(e) =>{
   if(e.key === "Enter"){
      handleSearch();
   }
});



async function fetchUserDetails(username){

      loadingScreen.classList.add("active");
   try{
      const response = await fetch(`https://api.github.com/users/${username}`);

      if(!response.ok){
         console.log("User not found");
         return;
      }
      const data = await response.json();
      renderUserData(data);
   }
   catch(error){
       console.log("Error fetching user :",error);
   }
   finally{
        loadingScreen.classList.remove("active");
   }
}

function renderUserData(userInfo) {
    const userImg = document.querySelector("[data-userImg]");
    const userName = document.querySelector("[data-userName]");
    const userJoinDate = document.querySelector("[data-userJoinDate]");
    const content = document.querySelector("[data-content]");
    const Repos = document.querySelector("[data-Repos]");
    const Followers = document.querySelector("[data-Followers]");
    const Following = document.querySelector("[data-Following]");
    const userLocation = document.querySelector("[data-userLocation]");
    const userTwitter = document.querySelector("[data-userTwitter]");
    const userGitLink = document.querySelector("[data-userGitLink]");
    const userCompany = document.querySelector("[data-userCompany]");
    const userLink = document.querySelector("[data-userLink]");

    
    userImg.src = userInfo?.avatar_url;
    userName.innerText = userInfo?.login;
    
    userLink.innerText = `@${userInfo.login}`;
    userLink.href = userInfo.html_url;

    const date = new Date(userInfo?.created_at);
    userJoinDate.innerText = date.toDateString();

    content.innerText = userInfo?.bio || "Not Available";
    Repos.innerText = userInfo?.public_repos;
    Followers.innerText = userInfo?.followers;
    Following.innerText = userInfo?.following;

    userLocation.innerText = userInfo?.location || "Not Available";
    userCompany.innerText = userInfo?.company || "Not Available";

    userGitLink.href = userInfo?.html_url;

    if (userInfo?.twitter_username) {
        userTwitter.href = `https://twitter.com/${userInfo.twitter_username}`;
        userTwitter.innerText = userInfo.twitter_username;
    } else {
        userTwitter.innerText = "Not Available";
    }
}


