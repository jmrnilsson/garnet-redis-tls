FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ENV VERSION "1.0.5"
WORKDIR /source
RUN wget -O ./source.tar.gz https://github.com/microsoft/garnet/archive/refs/tags/v$VERSION.tar.gz
RUN tar -xvzf ./source.tar.gz

WORKDIR /source/garnet-$VERSION
RUN dotnet restore
RUN dotnet build -c Release

WORKDIR /source/garnet-$VERSION/main/GarnetServer
RUN dotnet publish -c Release -o /app --self-contained true -f net8.0

FROM registry.access.redhat.com/ubi9/ubi-minimal

WORKDIR /app
COPY --from=build /app .
RUN microdnf install -y libicu
ENTRYPOINT ["/app/GarnetServer", "-i", "128m"]