const deleteItem = btn => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const deletedArticle = btn.closest("article");
  console.log(deletedArticle);

  fetch(`/admin/delete-product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      deletedArticle.parentNode.removeChild(deletedArticle);
    })
    .catch(err => console.log(err));
};
