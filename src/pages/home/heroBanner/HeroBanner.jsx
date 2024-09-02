import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { data, loading } = useFetch("/movie/popular");
    useEffect(() => {
        const bg =
        "https://image.tmdb.org/t/p/w1280" +
            data?.results?.[Math.floor(Math.random() * 18)]?.backdrop_path;
        setBackground(bg);
    }, [data,loading]);

    const searchQueryHandler = () => {
        if (query.length > 0) {
            navigate(`/search/${query}`);
        }
    };
    const searchBtnClick = () => {
        if (query.length > 0) {
            navigate(`/search/${query}`);
        }
    };

    return (
        <div className="heroBanner">
            {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">Welcome</span>
                    <span className="subTitle">
                        Millions of movies, TV shows and people to discover.
                        Explore now.
                    </span>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or tv show...."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchQueryHandler()
                                }
                              }}
                        />
                        <button onClick={searchBtnClick}>Search</button>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default HeroBanner;
