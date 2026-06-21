export type AssetEntry = {
  key: string;
  url: string;
};

export const assetManifest: AssetEntry[] = [
  { key: "cards/intro", url: "/assets/cards/Intro.jpg" },
  { key: "cards/intro2", url: "/assets/cards/intro2.jpg" },
  { key: "cards/manual", url: "/assets/cards/manual.jpg" },
  { key: "cards/aid_backside", url: "/assets/cards/Aid_card_backside.jpg" },
  { key: "cards/card_backside", url: "/assets/cards/card_backside.jpg" },
  { key: "cards/coins/coin", url: "/assets/cards/coins/coin.png" },
  { key: "cards/coins/coin_jin", url: "/assets/cards/coins/coin_jin.png" },
  { key: "cards/coins/coin_khajna", url: "/assets/cards/coins/coin_khajna.png" },
  { key: "cards/coins/coin_puppet", url: "/assets/cards/coins/coin_puppet.png" },
  {
    key: "cards/characterCards/character_arun",
    url: "/assets/cards/characterCards/character_arun.jpg",
  },
  {
    key: "cards/characterCards/character_bir_bikrom",
    url: "/assets/cards/characterCards/character_bir_bikrom.jpg",
  },
  {
    key: "cards/characterCards/character_brokho-doitto",
    url: "/assets/cards/characterCards/character_brokho-doitto.jpg",
  },
  {
    key: "cards/characterCards/character_ciske_chor",
    url: "/assets/cards/characterCards/character_ciske_chor.jpg",
  },
  {
    key: "cards/characterCards/character_hamdo-vut",
    url: "/assets/cards/characterCards/character_hamdo-vut.jpg",
  },
  {
    key: "cards/characterCards/character_jiner-badsha",
    url: "/assets/cards/characterCards/character_jiner-badsha.jpg",
  },
  {
    key: "cards/characterCards/character_kalu-dakat",
    url: "/assets/cards/characterCards/character_kalu-dakat.jpg",
  },
  {
    key: "cards/characterCards/character_mamdo_hamdo",
    url: "/assets/cards/characterCards/character_mamdo_hamdo.jpg",
  },
  {
    key: "cards/characterCards/character_nantu_mia",
    url: "/assets/cards/characterCards/character_nantu_mia.jpg",
  },
  {
    key: "cards/characterCards/character_petukcondro",
    url: "/assets/cards/characterCards/character_petukcondro.jpg",
  },
  {
    key: "cards/characterCards/character_putul_raja",
    url: "/assets/cards/characterCards/character_putul_raja.jpg",
  },
  {
    key: "cards/characterActionCards/action_arun",
    url: "/assets/cards/characterActionCards/action_arun.jpg",
  },
  {
    key: "cards/characterActionCards/action_bir_bikrom",
    url: "/assets/cards/characterActionCards/action_bir_bikrom.jpg",
  },
  {
    key: "cards/characterActionCards/action_brokho_doitto",
    url: "/assets/cards/characterActionCards/action_brokho_doitto.jpg",
  },
  {
    key: "cards/characterActionCards/action_ciske_chor",
    url: "/assets/cards/characterActionCards/action_ciske_chor.jpg",
  },
  {
    key: "cards/characterActionCards/action_jiner_badsha",
    url: "/assets/cards/characterActionCards/action_jiner_badsha.jpg",
  },
  {
    key: "cards/characterActionCards/action_kalu_dakat",
    url: "/assets/cards/characterActionCards/action_kalu_dakat.jpg",
  },
  {
    key: "cards/characterActionCards/action_mamdo_hamdo",
    url: "/assets/cards/characterActionCards/action_mamdo_hamdo.jpg",
  },
  {
    key: "cards/characterActionCards/action_nantu_mia",
    url: "/assets/cards/characterActionCards/action_nantu_mia.jpg",
  },
  {
    key: "cards/characterActionCards/action_petukcondro",
    url: "/assets/cards/characterActionCards/action_petukcondro.jpg",
  },
  {
    key: "cards/characterActionCards/action_pretraj",
    url: "/assets/cards/characterActionCards/action_pretraj.jpg",
  },
  {
    key: "cards/characterActionCards/action_putul_raj",
    url: "/assets/cards/characterActionCards/action_putul_raj.jpg",
  },
  {
    key: "cards/generalActionCards/general_action_ay",
    url: "/assets/cards/generalActionCards/general_action_ay.jpg",
  },
  {
    key: "cards/generalActionCards/general_action_hotta",
    url: "/assets/cards/generalActionCards/general_action_hotta.jpg",
  },
];

export const characterCardKeys = assetManifest
  .filter((asset) => asset.key.includes("characterCards/"))
  .map((asset) => asset.key);
