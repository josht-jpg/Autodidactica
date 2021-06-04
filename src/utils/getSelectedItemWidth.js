const getSelectedItemWidth = (screenWidth, sidebarWidth) =>
  `calc(${screenWidth}px - ${sidebarWidth}px - 2.75%)`;

export default getSelectedItemWidth;
