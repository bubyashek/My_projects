#include "NoAbilitiesAvailable.h"

NoAbilitiesAvailable::NoAbilitiesAvailable()
{
    message = "No abilities are available!";
}

const char *NoAbilitiesAvailable::what() const noexcept
{
    return message.c_str();
}
