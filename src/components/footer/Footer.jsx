const Footer = () => {
  return (
    <div className="flex w-full flex-row h-full items-center justify-center shadow-lg bg-white rounded-2xl lg:px-8 xl:flex-row">
      <h5 className="text-center py-5 w-full text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
          ©{1900 + new Date().getYear()} Possibly. All Rights Reserved.
      </h5>
    </div>
  );
};

export default Footer;
