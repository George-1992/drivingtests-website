export const handleSignIn = async (data) => {
    //dummy 250ms wait
    await new Promise((resolve) => setTimeout(resolve, 350));

    let resObj = {
        success: false,
        message: "Invalid email or password.",
    };
    return resObj;
}

export const handleSignUp = async (data) => {
    //dummy 250ms wait
    await new Promise((resolve) => setTimeout(resolve, 650));
    let resObj = {
        success: false,
        message: "Region is not supported yet.",
    };
    return resObj;
}