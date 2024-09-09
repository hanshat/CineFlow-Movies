import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import Player from "./pages/player/Player";
import ExploreAnime from "./pages/explore/ExploreAnime";
import DetailsAnime from "./pages/details/DetailsAnime";
import PlayerAnime from "./pages/player/PlayerAnime";
import ExploreTv from "./pages/explore/ExploreTv";
import PlayerTv from "./pages/player/PlayerTv";
import CastDetailsBanner from "./pages/details/cast/CastDetail";
import ExploreLogin from "./pages/explore/ExploreLogin";
import ExploreSignup from "./pages/explore/ExploreSignup";
import ExploreUploadMovie from "./pages/explore/ExploreUploadMovie.jsx";
import ExploreUploadTv from "./pages/explore/ExploreUploadTv.jsx";

function App() {
    const dispatch = useDispatch();
    const { url } = useSelector((state) => state.home);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchApiConfig();
        genresCall();
    }, []);

    const fetchApiConfig = () => {
        fetchDataFromApi("/configuration").then((res) => {

            const url = {
                backdrop: res.images.secure_base_url + "w1280",
                poster: res.images.secure_base_url + "w185",
                profile: res.images.secure_base_url + "w185",
            };

            dispatch(getApiConfiguration(url));
        });
    };

    const genresCall = async () => {
        let promises = [];
        let endPoints = ["tv", "movie"];
        let allGenres = {};

        endPoints.forEach((url) => {
            promises.push(fetchDataFromApi(`/genre/${url}/list`));
        });

        const data = await Promise.all(promises);
        data.map(({ genres }) => {
            return genres.map((item) => (allGenres[item.id] = item));
        });

        dispatch(getGenres(allGenres));
    };

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore/upload/movie" element={<ExploreUploadMovie />} />
                <Route path="/explore/upload/tv" element={<ExploreUploadTv />} />
                {/* <Route path="/anime/:id" element={<DetailsAnime />} /> */}
                <Route path="/:mediaType/:id" element={<Details />} />
                <Route path="/player/livetv/:id" element={<PlayerTv />} />
                <Route path="/player/anime/:id" element={<PlayerAnime />} />
                <Route path="/player/:mediaType/:id/:title" element={<Player />} />
                <Route path="/search/:query" element={<SearchResult />} />
                <Route path="/explore/anime" element={<ExploreAnime />} />
                <Route path="/explore/login" element={<ExploreLogin setUser={setUser}/>} />
                <Route path="/explore/signup" element={<ExploreSignup setUser={setUser}/>} />
                <Route path="/explore/livetv" element={<ExploreTv />} />
                <Route path="/explore/:mediaType" element={<Explore />} />
                <Route path="/cast/:person_id" element={<CastDetailsBanner />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            {/* <Footer /> */}
        </Router>
    );
}

export default App;
