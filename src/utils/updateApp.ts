import initLocalStorage from "@/store/initLocalStorage";

const updateSetting = () => {
    const parsedSetting = JSON.parse(localStorage.getItem('settings') as string)
    const settings = {
        ...initLocalStorage.settings,
        ...parsedSetting
    };
    localStorage.setItem('settings', JSON.stringify(settings));

}
const updateData = () => {
    const parsedData = JSON.parse(localStorage.getItem('data') as string)
    const data = {...parsedData}
    localStorage.setItem('data', JSON.stringify(data))
}

export default function () {
    updateSetting();
    updateData();
}
