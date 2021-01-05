import { onNavigate } from "../../utils/history.js";
import { Review, ReviewsData, UserProfileInfo, signOut, ReviewPost, } from "../../services/index.js";

export const Timeline = () => {
    const rootElement = document.createElement('div');
    rootElement.innerHTML = `
    <div class="flex-container">
        <button class="flex-itens" id="signout-button">Sign Out</button> 
        <p class="flex-itens" id="hello-name"></p>
        <p class="flex-itens">Would you like to write a review?</p>

        <form id="form-add-review" class="flex-container">

            <label class="flex-itens" for="movie-serie-name">Movie/serie name:</label>
            <input class="flex-itens" id="movie-serie-name" type="text" placeholder="" required>

            <label class="flex-itens" for="review">Review in 400 charactes:</label>
            <input class="flex-itens" id="review" type="text" placeholder="" maxLength="500" required>
            
            <label class="flex-itens">I saw it on:</label>
            <select class="flex-itens" id="platform-choices">
              <option value="netflix">Netflix</option>
              <option value="prime-video">Prime Video</option>
              <option value="hbo-go">HBO Go</option>
              <option value="globoplay">Globoplay</option>
              <option value="disney">Disney+</option>
              <option value="other">Other</option>
            </select>

            <label class="flex-itens">Rating:</label>
            <select class="flex-itens" id="rating-stars">
              <option value="zero">0 stars</option>
              <option value="one">1 star</option>
              <option value="two">2 stars</option>
              <option value="three">3 stars</option>
              <option value="four">4 stars</option>
              <option value="five">5 stars</option>
            </select>

            <button class="flex-itens" id="publish-review">Publish</button>
        
        </form>

        <h2 class="flex-itens">Recents reviews</h2>
        <ul class="flex-itens" id="recent-reviews"></ul>
    </div>
    `;

    const logOutButton = rootElement.querySelector("#logout-button");
    const titleHello = rootElement.querySelector("#hello-name");
    const formReview = rootElement.querySelector("#form-add-review");
    const movieName = rootElement.querySelector("#movie-serie-name");
    const reviewText = rootElement.querySelector("#review");
    const platform = rootElement.querySelector("#platform-choices");
    const rating = rootElement.querySelector("#rating-stars");
    const publish = rootElement.querySelector("#publish-review");
    const recentReviews = rootElement.querySelector("#recent-reviews");
    const signOutButton = rootElement.querySelector('#signout-button');

    signOutButton.addEventListener('click', () => {
        signOut()
            .then(() => {
                onNavigate("/");
            })
            .catch((error) => {
                alert(error.code + error.message)
            })
    })
    
    publish.addEventListener('click', (e) => {
        e.preventDefault();
        Review(movieName.value, reviewText.value, platform.options[platform.selectedIndex].text, rating.options[rating.selectedIndex].text);
        formReview.reset();
    })

    // const deleteReviews = (x) => {
    //     ReviewPost(x).delete().then(res => {onNavigate('/timeline')})
    // }

    const addPost = (doc) => {
        doc.forEach(post => {
            const postTemplate = `
            <li>
                <p>${post.data().name}</p>
                <p>${post.data().username}</p>
                <button id="${post.id}" class="delete-button">&#128465;</button>
                <p>${post.data().movieName}</p>
                <p>Rating: ${post.data().rating}</p>
                <p>Watched on: ${post.data().plataform}</p>
                <p>${post.data().review}</p>
                <button id="agree-button">&#128077; ${post.data().agree > 0 ? post.data().agree : ""}</button>
                <button id="disagree-button">&#128078; ${post.data().disagree > 0 ? post.data().disagree : ""}</button>
            </li>
            `;
            recentReviews.innerHTML += postTemplate
        })

    //     const deleteButton = recentReviews.querySelectorAll(".delete-button");
        
    //     deleteButton.forEach(button => {
    //         button.addEventListener('click', (event) => {
    //             deleteReviews(event.currentTarget);
    //         })
    //     })
    }

    const loadReviews = () => {
        recentReviews.innerHTML = 'Carregando...';
        ReviewsData()
            .then(doc => {
                recentReviews.innerHTML = '';
                addPost(doc);
            }) 
    }

    const headerName = () => {
        console.log(UserInfoUid())
        UserProfileInfo(UserInfoUid())
            .then(user => {
                titleHello.innerHTML = `Hello, ${user.data()}`
            })
    }

    // const agreeButton = postTemplate.querySelector("#agree-button");
    // const disagreeButton = postTemplate.querySelector("#disagree-button");

    // agreeButton.addEventListener('click', (e) => {
    // e.preventDefault();

    // })

    loadReviews();
    headerName();

    return rootElement
}