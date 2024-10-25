function ToggleButton(id)
{
    let btn = document.getElementById(id);
    btn.classList.toggle("btn-outline-success");
    btn.classList.toggle("btn-outline-danger");
}