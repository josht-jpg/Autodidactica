const handleNewMaterialResponse = (materials, newMaterial) =>
  materials &&
  newMaterial &&
  !materials.map((m) => m._id).includes(newMaterial._id) &&
  materials.push(newMaterial);
export default handleNewMaterialResponse;
