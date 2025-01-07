function ToggleButton(id)
{
    let btn = document.getElementById(id);
    btn.classList.toggle("btn-outline-success");
    btn.classList.toggle("btn-outline-danger");
}

function ShowBackground()
{
    pageContent = document.getElementById("contentDiv");

    if(pageContent.style.display == "block" || pageContent.style.display == "")
    {
        pageContent.style.display = "none"
    }
    else
    {
        pageContent.style.display = "block"
    }
}

