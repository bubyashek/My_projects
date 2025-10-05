#pragma once
#include <exception>
#include <string>

class NoAbilitiesAvailable : public std::exception
{
    std::string message;

public:
    NoAbilitiesAvailable();
    const char *what() const noexcept override;
};