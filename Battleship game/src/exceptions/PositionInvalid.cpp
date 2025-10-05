#include "PositionInvalid.h"

PositionInvalid::PositionInvalid()
{
    message = "Position is not in the field and is invalid!";
}

const char *PositionInvalid::what() const noexcept
{
    return message.c_str();
}
