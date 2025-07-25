import React from 'react'

const NewRequestModalContent = () => {
    const [modalStartDate, setModalStartDate] = useState('');
    const [modalEndDate, setModalEndDate] = useState('');
    const [modalLeaveType, setModalLeaveType] = useState('');
    const [modalReason, setModalReason] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isModalSubmitting, setIsModalSubmitting] = useState(false);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files.map(f => f.name)]);
    };

    const removeAttachment = (fileName) => {
      setAttachments(prev => prev.filter(name => name !== fileName));
    };

    const calculateModalDays = () => {
      if (!modalStartDate || !modalEndDate) return 0;
      const start = new Date(modalStartDate);
      const end = new Date(modalEndDate);
      if (end < start) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleModalSubmit = (e) => {
      e.preventDefault();
      if (!modalStartDate || !modalEndDate || !modalLeaveType || !modalReason) {
         alert('Please fill in all required fields.');
         return;
      }
      setIsModalSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        alert('Leave request submitted successfully!');
        setIsModalSubmitting(false);
        // Reset form
        setModalStartDate('');
        setModalEndDate('');
        setModalLeaveType('');
        setModalReason('');
        setAttachments([]);
        // In a real app, you'd close the dialog and potentially refresh the request list
        // This requires managing the dialog's open state, often done by the parent Dialog component
        // For simplicity here, just alert and reset. The dialog will close when the trigger is clicked again or via DialogClose.
      }, 1500);
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            New Leave Request
          </DialogTitle>
          <DialogDescription>
            Please fill in the details for your leave request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleModalSubmit} className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modalStartDate" className="text-sm font-medium flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                Start Date *
              </Label>
              <Input
                id="modalStartDate"
                type="date"
                value={modalStartDate}
                onChange={(e) => setModalStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalEndDate" className="text-sm font-medium flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                End Date *
              </Label>
              <Input
                id="modalEndDate"
                type="date"
                value={modalEndDate}
                onChange={(e) => setModalEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                min={modalStartDate || undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modalLeaveType" className="text-sm font-medium flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                Leave Type *
              </Label>
              <Select value={modalLeaveType} onValueChange={setModalLeaveType}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="flex items-center">
                      <div className={`flex items-center px-2 py-1 rounded ${type.color}`}>
                        {React.createElement(type.icon, { className: "w-4 h-4 mr-2" })}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                Duration
              </Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">{calculateModalDays() || 0} day{calculateModalDays() !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modalReason" className="text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              Reason for Leave *
            </Label>
            <Textarea
              id="modalReason"
              value={modalReason}
              onChange={(e) => setModalReason(e.target.value)}
              placeholder="Please provide a brief reason for your leave request..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* Attachment Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
              Attachments (Optional)
            </Label>
            <div className="border border-gray-300 rounded-md p-3">
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PDF, DOC, JPG up to 10MB</span>
              </Label>

              {/* Display selected files */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-700">Selected Files:</p>
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border">
                        <div className="flex items-center truncate">
                          <FileText className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{file}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file)}
                          className="text-gray-500 hover:text-red-500 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isModalSubmitting}>
              {isModalSubmitting ? (
                <>
                  <Clock3Icon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </>
    );
  };


export default NewRequestModal