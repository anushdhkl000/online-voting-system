const checkPermission = (permission, userPermissions) => {
    const hasPermission = userPermissions.includes(permission);
    const role = localStorage.getItem("role");
    if (role === "super-admin") {
        return true;
    } else {
        return hasPermission;
    }
}

export default checkPermission