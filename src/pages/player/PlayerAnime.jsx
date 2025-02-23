import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import axios from "axios";
import Spinner from "../../components/spinner/Spinner";
import Img from "../../components/lazyLoadImage/Img";

const PlayerAnime = () => {
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodeCount, setEpisodeCount] = useState(null);
  let backdrop_path = localStorage.getItem("current_backdrop_path");
  const { id } = useParams();
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [selectedSource, setSelectedSource] = useState("");
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleEpisodeClick = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
  };

  const handleButtonClick = (index) => {
    setSelectedSourceIndex(index);
    setSelectedSource(sources[index].url);
  };

  useEffect(() => {
    const fetchAnimeData = async () => {
      const url = 'https://http-cors-proxy.p.rapidapi.com/';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '43db6998cdmsh2ebabcbb7bfe84ep1865b9jsn0406325a9b5c',
          'x-rapidapi-host': 'http-cors-proxy.p.rapidapi.com',
          'Content-Type': 'application/json',
          Origin: 'www.example.com',
          'X-Requested-With': 'www.example.com',
        },
        data: {
          url: `https://api.anix.my/movies/detail/${id}`,
        },
      };

      try {
        const response = await axios.request(url, options);
        setEpisodeCount(response.data.data.latest_episode.episode);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAnimeData();
  }, [id]);

  useEffect(() => {
    let slug = id + "-episode-" + selectedEpisode;
    const getLinks = async () => {
      const url = 'https://http-cors-proxy.p.rapidapi.com/';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '43db6998cdmsh2ebabcbb7bfe84ep1865b9jsn0406325a9b5c',
          'x-rapidapi-host': 'http-cors-proxy.p.rapidapi.com',
          'Content-Type': 'application/json',
          Origin: 'www.example.com',
          'X-Requested-With': 'www.example.com',
        },
        data: {
          url: `https://api.anix.my/episodes/detail/${slug}`,
        },
      };

      try {
        const response = await axios.request(url, options);
        setSources(response.data.data.links);
        const links = response.data.data.links;
        const fileLionsIndex = links.findIndex(
          (link) => link.type === "ASIANLOAD"
        );
        if (fileLionsIndex !== -1) {
          setSelectedSourceIndex(fileLionsIndex);
          setSelectedSource(links[fileLionsIndex].url);
        } else {
          setSelectedSource(links[0].url);
          setSelectedSourceIndex(0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLinks();
  }, [selectedEpisode]);

  return (
    <div className="player">
      <div className="backdrop1-img">
        <div style={{ position: "absolute" }}>
          {loading && <Spinner initial={true} />}
        </div>
        <Img src={backdrop_path} />
      </div>
      <iframe
        id="dd"
        src={selectedSource}
        width="90%"
        height="700px"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      ></iframe>
      <div className="source-buttons">
        {sources?.map((source, index) => (
          <div
            key={index}
            onClick={() => handleButtonClick(index)}
            className={
              selectedSourceIndex === index
                ? "source-btn-active button-62"
                : "button-62"
            }
          >
            {source.type}
          </div>
        ))}
      </div>
      <div>
        <div className="episode-container-anime">
          {Array.from({ length: episodeCount }, (_, index) => index + 1).map(
            (episodeNumber) => (
              <div
                className={
                  selectedEpisode === episodeNumber
                    ? "episode-div-active episode-div"
                    : "episode-div"
                }
                key={episodeNumber}
                onClick={() => handleEpisodeClick(episodeNumber)}
              >
                E{episodeNumber}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerAnime;
