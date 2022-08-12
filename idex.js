const setRenderBackground = async () => {
  const response = await axios.get("https://picsum.photos/1280/720", {
    responseType: "blob",
  });

  const imageURL = URL.createObjectURL(response.data);
  document.querySelector("body").style.backgroundImage = `url(${imageURL})`;
};

setRenderBackground();
setInterval(() => {
  setRenderBackground();
}, 5000);

const setTime = () => {
  const timer = document.querySelector(".timer");
  const timerContent = document.querySelector(".timer-content");
  setInterval(() => {
    const date = new Date();

    let hr = String(date.getHours());
    let min = String(date.getMinutes());
    let sec = String(date.getSeconds());

    if (Number(hr) < 10) {
      hr = "0" + hr;
    }
    if (Number(min) < 10) {
      min = "0" + min;
    }
    if (Number(sec) < 10) {
      sec = "0" + sec;
    }

    timer.textContent = `${hr}:${min}:${sec}`;

    if (date.getHours() >= 0 && date.getHours() < 12) {
      timerContent.textContent = "Good morning!";
    } else if (date.getHours() >= 12 && date.getHours() < 24) {
      timerContent.textContent = "Good evening!";
    }
  }, 1000);
};

const getMemo = () => {
  const memo = document.querySelector(".memo");
  const memoValue = localStorage.getItem("todo");
  memo.textContent = memoValue;
};

// 로컬 스토리지에 메모 저장
const setMemo = () => {
  memoInput = document.querySelector(".memo-input");
  memoInput.addEventListener("keyup", (evt) => {
    // 엔터이면서, 뭐라도 값이 들어있다면
    if (evt.code === "Enter" && evt.currentTarget.value) {
      // localStorage에 key:todo, value:e.currentTarget.value 저장
      localStorage.setItem("todo", evt.currentTarget.value);
      // 메모 가져와서 붙임
      getMemo();
      // Input창 깔끔하게 지워줌
      memoInput.value = "";
    }
  });
};

const deleteMemo = () => {
  document.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("memo")) {
      // 로컬에 아이템 지우기
      localStorage.removeItem("todo");
      // 글 내용 지우기
      evt.target.textContent = "";
    }
  });
};

const setModalDate = () => {
  const modalDate = document.querySelector(".modal-date");
  const date = new Date();
  modalDate.textContent = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;
};

const lat = 35.16;
const lon = 126.85;
const apiKey = "03414a7d32f96f5db3fdb6bd6b347357";

const matchIcon = (weatherDate) => {
  if (weatherDate === "Clear") {
    return "./icons/039-sun.png";
  }
  if (weatherDate === "Clouds") {
    return "./icons/001-cloud.png";
  }
  if (weatherDate === "Rain") {
    return "./icons/003-rainy.png";
  }
  if (weatherDate === "Snow") {
    return "./icons/006-snowy.png";
  }
  if (weatherDate === "Thunderstorm") {
    return "./icons/008-storm.png";
  }
  if (weatherDate === "Drizzle") {
    return "./icons/033-hurricane.png";
  }
};

const getWeather = async (lat, lon, apiKey) => {
  const data = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  return data;
};

const getNowWeather = async (lat, lon, apiKey) => {
  const data = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current&appid=${apiKey}`
  );
  console.log(data);
  return data;
};

const weatherWrapperComponent = (li) => {
  const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
  return `
    <div class="card">
      <div class="card-header">${li.dt_txt.split(" ")[0].split("-")[1]}월 ${li.dt_txt.split(" ")[0].split("-")[2]}일</div>
      <div class="card-body">
        <h5 class="card-title">${li.weather[0].main}</h5>
        <img src="${matchIcon(
          li.weather[0].main
        )}" width="60px" height="60px" class="card-img-top" alt="날씨">
        <p class="card-text">${changeToCelsius(li.main.temp)}˚</p>
      </div>
    </div>`;
};

const renderWeather = async (lat, lon, apiKey) => {
  const weatherResponse = await getWeather(lat, lon, apiKey);
  const weatherData = weatherResponse.data;
  console.log(weatherData);
  const weatherList = weatherData.list.reduce((total, cur) => {
    if (cur.dt_txt.indexOf("18:00:00") > 0) {
      total.push(cur);
    }
    return total;
  }, []);

  console.log(weatherList);
  const cardGroup = document.querySelector(".card-group");
  cardGroup.innerHTML = weatherList
    .map((li) => {
      return weatherWrapperComponent(li);
    })
    .join("");
};

const renderIcon = async (lat, lon, apiKey) => {
  const nowWeatherResponse = await getNowWeather(lat, lon, apiKey);
  const nowWeatherData = nowWeatherResponse.data.weather[0].main;
  const icon = document.querySelector(".modal-button");
  icon.style.backgroundImage = `url(${matchIcon(nowWeatherData)})`;
};

// 시간 설정
setTime();
// 메모 로컬스토리지에 등록 및 화면 붙이기
setMemo();
// 메모 로컬스토리지에서 삭제 및 화면 지우기
deleteMemo();
// Modal Header에 오늘 날짜 출력
setModalDate();
// 현재부터 5일간의 날씨를 Modal 출력
renderWeather(lat, lon, apiKey);
// 현재 날씨에 맞게 Modal Icon 변경
renderIcon(lat, lon, apiKey);
