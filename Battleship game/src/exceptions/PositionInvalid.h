#pragma once
#include <exception>
#include <string>

class PositionInvalid : public std::exception
{
    std::string message;

public:
    PositionInvalid();
    const char *what() const noexcept override;
};
