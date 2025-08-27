import { useState, useEffect } from 'react';
import { useDevapp, UserButton, DevappProvider, openLink } from '@devfunlabs/web-sdk';
import { motion } from 'framer-motion';
export default function AppWithProvider() {
  return <DevappProvider rpcEndpoint="https://rpc.dev.fun/27906a144d55a012351a" devbaseEndpoint="https://devbase.dev.fun" appId="27906a144d55a012351a">
      <App />
    </DevappProvider>;
}
function PixelatedText({
  children,
  className = "",
  size = "md"
}) {
  const sizeClasses = {
    sm: "text-xs md:text-sm",
    md: "text-sm md:text-lg",
    lg: "text-base md:text-xl",
    xl: "text-lg md:text-2xl",
    "2xl": "text-xl md:text-3xl"
  };
  return <div className={`font-pixel ${sizeClasses[size]} ${className} pixel-text`}>
      {children}
    </div>;
}
function PixelButton({
  children,
  onClick,
  color = "blue",
  disabled = false,
  className = ""
}) {
  const colorClasses = {
    blue: "bg-[#3498db] hover:bg-[#33e6ff] border-b-4 border-[#0a3d62] hover:border-[#33e6ff] text-white",
    green: "bg-[#4cd964] hover:bg-[#4cd964] border-b-4 border-[#2ecc71] hover:border-[#27ae60] text-white",
    red: "bg-[#ff3b30] hover:bg-[#ff3b30] border-b-4 border-[#c0392b] hover:border-[#e74c3c] text-white",
    yellow: "bg-[#ffde00] hover:bg-[#ffde00] border-b-4 border-[#f39c12] hover:border-[#f1c40f] text-black",
    purple: "bg-[#6c5ce7] hover:bg-[#6c5ce7] border-b-4 border-[#5b48d0] hover:border-[#4834d4] text-white",
    pink: "bg-[#ff69b4] hover:bg-[#ff69b4] border-b-4 border-[#e84393] hover:border-[#fd79a8] text-white"
  };
  return <motion.button onClick={onClick} disabled={disabled} whileHover={{
    scale: 1.05,
    boxShadow: "0 0 8px 2px #ffde00"
  }} whileTap={{
    y: 2
  }} className={`${colorClasses[color]} px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-button transform transition-all active:translate-y-1 active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] border-2 border-black text-xs sm:text-base ${className}`}>
      <PixelatedText size="md">{children}</PixelatedText>
    </motion.button>;
}
function PixelCard({
  children,
  className = ""
}) {
  return <div className={`bg-white border-2 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none scanlines opacity-10"></div>
      {children}
    </div>;
}
function Confetti() {
  return <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({
      length: 50
    }).map((_, index) => {
      const size = Math.random() * 10 + 5;
      const colors = ["#ff69b4", "#ffde00", "#33e6ff", "#3498db", "#6c5ce7", "#4cd964"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 2;
      const delay = Math.random();
      return <motion.div key={index} className="absolute w-2 h-2 rounded-sm" style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: `${left}%`,
        top: -20
      }} initial={{
        top: -20
      }} animate={{
        top: "120%",
        rotate: [0, 360],
        x: [0, Math.random() * 100 - 50]
      }} transition={{
        duration: animationDuration,
        delay: delay,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 0
      }} />;
    })}
    </div>;
}
function PixelImage({
  src,
  alt,
  className = ""
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return <div className={`relative overflow-hidden rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${className}`}>
      {!loaded && !error && <div className="absolute inset-0 bg-[#0a3d62] bg-opacity-10 flex items-center justify-center min-h-[6rem]">
          <motion.div className="w-12 h-12 grid grid-cols-4 grid-rows-4 gap-1" initial={{
        opacity: 0.6
      }} animate={{
        opacity: 1
      }}>
            {Array.from({
          length: 16
        }).map((_, i) => <motion.div key={i} className="bg-[#33e6ff]" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.3,
          delay: i * 0.05,
          repeat: Infinity,
          repeatType: "reverse"
        }} />)}
          </motion.div>
        </div>}
      {error ? <div className="w-full h-24 bg-[#0a3d62] bg-opacity-10 flex items-center justify-center">
          <PixelatedText size="sm" className="text-[#0a3d62]">Image not available</PixelatedText>
        </div> : <img src={src} alt={alt} className={`w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} style={{
      imageRendering: 'pixelated'
    }} onLoad={() => setLoaded(true)} onError={() => setError(true)} />}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30"></div>
    </div>;
}
function QuestionCard({
  question,
  onVote,
  userWallet,
  onClaim
}) {
  const [userVote, setUserVote] = useState(null);
  const [showShareButton, setShowShareButton] = useState(false);
  const isExpired = new Date(question.expiresAt) < new Date();
  const isResolved = question.outcome !== null;
  const totalVotes = question.yesVotes + question.noVotes;
  const yesPercentage = totalVotes === 0 ? 0 : Math.round(question.yesVotes / totalVotes * 100);
  const noPercentage = totalVotes === 0 ? 0 : Math.round(question.noVotes / totalVotes * 100);
  const userVotedCorrectly = userVote === question.outcome;
  const hasUserClaimed = question.claimedBy && question.claimedBy.includes(userWallet);
  const canClaim = isResolved && userVotedCorrectly && !hasUserClaimed && userWallet;
  useEffect(() => {
    if (question.votes && userWallet) {
      const vote = question.votes.find(v => v.userId === userWallet);
      if (vote) {
        setUserVote(vote.prediction);
        setShowShareButton(true);
      } else {
        setUserVote(null);
        setShowShareButton(false);
      }
    } else {
      setUserVote(null);
      setShowShareButton(false);
    }
  }, [question.votes, userWallet]);
  const handleShare = () => {
    const baseUrl = "https://twitter.com/intent/tweet";
    const text = `I just predicted "${userVote.toUpperCase()}" on "${question.title}" at YesNoDAO! Join me and predict the future to get paid for it! https://dev.fun/p/27906a144d55a012351a built with @devfunpump`;
    const url = `${baseUrl}?text=${encodeURIComponent(text)}`;
    openLink(url);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const getOutcomeLabel = () => {
    if (!isResolved) return "Pending...";
    return question.outcome === "yes" ? "YES!" : "NO!";
  };
  const getRewardAmount = () => {
    if (!isResolved || !userVotedCorrectly) return 0;
    const totalCorrectVotes = question.outcome === "yes" ? question.yesVotes : question.noVotes;
    if (totalCorrectVotes <= 0) return 0;
    const voteAmount = question.voteAmount || 0.001;
    const poolAmount = question.totalPool || question.votes?.length * voteAmount || 0;
    if (poolAmount <= 0) return 0;
    const reward = poolAmount * 0.95 / totalCorrectVotes;
    const flooredReward = Math.floor(reward * 10000) / 10000;
    return isNaN(flooredReward) || flooredReward <= 0 ? "0.0000" : flooredReward.toFixed(4);
  };
  return <PixelCard className="w-full h-full overflow-hidden">
      <div className="bg-gradient-to-r from-[#ff69b4] via-[#6c5ce7] to-[#3498db] -m-4 mb-4 p-2 sm:p-4 border-b-2 border-black">
        <PixelatedText size="lg" className="text-white mb-2">{question.title}</PixelatedText>
        <div className="flex flex-col sm:flex-row sm:justify-between text-white gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <PixelatedText size="sm">Pool: {question.totalPool.toFixed(3)} SOL</PixelatedText>
            <PixelatedText size="sm" className="sm:border-l sm:border-white sm:border-opacity-30 sm:pl-3">
              Vote Cost: {question.voteAmount || 0.001} SOL
            </PixelatedText>
          </div>
          <PixelatedText size="sm">
            {isExpired ? isResolved ? "Resolved" : "Awaiting Result" : `Ends: ${formatDate(question.expiresAt)}`}
          </PixelatedText>
        </div>
      </div>
      {question.imageUrl && <div className="mb-4 flex justify-center">
          <PixelImage src={question.imageUrl} alt={question.title} className="w-2/3 max-w-sm" />
        </div>}
      <div className="mb-4">
        <PixelatedText className="font-body text-[#0a3d62] text-sm sm:text-base">{question.description}</PixelatedText>
      </div>
      {!isExpired && <div className="flex flex-col items-center mb-4">
          {userVote ? <div className="bg-[#33e6ff] bg-opacity-20 border-2 border-[#33e6ff] rounded-lg p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <PixelatedText size="md" className="text-[#0a3d62]">
                You voted: <span className={userVote === "yes" ? "text-[#4cd964]" : "text-[#ff3b30]"}>{userVote.toUpperCase()}</span>
              </PixelatedText>
            </div> : <>
              <PixelatedText size="sm" className="text-[#0a3d62] mb-2 bg-[#ffde00] bg-opacity-20 py-1 px-3 rounded-lg border border-[#ffde00]">
                Cost to vote: {question.voteAmount || 0.001} SOL
              </PixelatedText>
              <div className="flex space-x-3 sm:space-x-4">
                <PixelButton color="green" onClick={() => onVote(question.id, "yes")} disabled={!userWallet || userVote !== null}>
                  YES
                </PixelButton>
                <PixelButton color="red" onClick={() => onVote(question.id, "no")} disabled={!userWallet || userVote !== null}>
                  NO
                </PixelButton>
              </div>
            </>}
        </div>}
      {}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <PixelatedText size="sm" className="text-[#4cd964]">YES: {question.yesVotes}</PixelatedText>
          <PixelatedText size="sm" className="text-[#ff3b30]">NO: {question.noVotes}</PixelatedText>
        </div>
        <div className="h-5 sm:h-6 bg-[#0a3d62] bg-opacity-20 rounded-full overflow-hidden border-2 border-black">
          <div className="h-full bg-gradient-to-r from-[#4cd964] to-[#33e6ff]" style={{
          width: `${yesPercentage}%`
        }}></div>
        </div>
        <div className="flex justify-between mt-1">
          <PixelatedText size="sm" className="text-[#0a3d62]">{yesPercentage}%</PixelatedText>
          <PixelatedText size="sm" className="text-[#0a3d62]">{noPercentage}%</PixelatedText>
        </div>
        {showShareButton && userVote && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mt-3 flex justify-center">
            <PixelButton color="blue" onClick={handleShare} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Share on X
            </PixelButton>
          </motion.div>}
      </div>
      {isResolved && <div className={`p-3 rounded-lg mb-4 text-center border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${question.outcome === "yes" ? "bg-[#4cd964] bg-opacity-20 border-[#4cd964]" : "bg-[#ff3b30] bg-opacity-20 border-[#ff3b30]"}`}>
          <PixelatedText size="lg" className={question.outcome === "yes" ? "text-[#4cd964]" : "text-[#ff3b30]"}>
            Outcome: {getOutcomeLabel()}
          </PixelatedText>
        </div>}
      {userVotedCorrectly && isResolved && <div className="bg-[#ffde00] bg-opacity-20 border-2 border-[#ffde00] rounded-lg p-3 mb-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
          <PixelatedText size="md" className="text-[#0a3d62]">
            You win! Reward: {getRewardAmount()} SOL
          </PixelatedText>
          {canClaim && <PixelButton color="yellow" onClick={() => onClaim(question.id)} className="mt-2">
              Claim Reward
            </PixelButton>}
          {hasUserClaimed && <PixelatedText size="sm" className="text-[#0a3d62] mt-2">
              Reward claimed!
            </PixelatedText>}
        </div>}
    </PixelCard>;
}
function CreatePredictionModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [voteAmount, setVoteAmount] = useState("0.001");
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      imageUrl,
      expiresAt: new Date(expiresAt).toISOString(),
      outcome: null,
      totalPool: 0,
      resolvedAt: null,
      voteAmount: parseFloat(voteAmount)
    });
    setTitle("");
    setDescription("");
    setImageUrl("");
    setExpiresAt("");
    setVoteAmount("0.001");
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.8,
      opacity: 0
    }} className="w-full max-w-md">
        <PixelCard className="w-full">
          <div className="flex justify-between items-center mb-4">
            <PixelatedText size="lg" className="text-[#6c5ce7]">Create Prediction</PixelatedText>
            <motion.button onClick={onClose} className="text-[#0a3d62] hover:text-[#ff3b30]" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <PixelatedText>✕</PixelatedText>
            </motion.button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">
                <PixelatedText size="sm" className="text-[#0a3d62]">Question Title</PixelatedText>
              </label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] font-body" required />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                <PixelatedText size="sm" className="text-[#0a3d62]">Description</PixelatedText>
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] font-body" rows="3" required />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                <PixelatedText size="sm" className="text-[#0a3d62]">Image URL (Optional)</PixelatedText>
              </label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] font-body" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                <PixelatedText size="sm" className="text-[#0a3d62]">Expires At</PixelatedText>
              </label>
              <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] font-body" required />
            </div>
            <div className="mb-6">
              <label className="block mb-2">
                <PixelatedText size="sm" className="text-[#0a3d62]">Vote Amount (SOL)</PixelatedText>
              </label>
              <input type="number" step="0.001" min="0.001" value={voteAmount} onChange={e => setVoteAmount(e.target.value)} className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] font-body" required />
              <p className="mt-1 text-xs text-[#0a3d62] opacity-70 font-body">Amount users will pay to vote on this prediction</p>
            </div>
            <div className="flex justify-end">
              <PixelButton color="pink" className="w-full">
                Create Prediction
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </motion.div>
    </div>;
}
function AdminMetricsCard({
  questions,
  votes,
  claims
}) {
  const totalPredictions = questions.length;
  const activePredictions = questions.filter(q => q.outcome === null).length;
  const resolvedPredictions = questions.filter(q => q.outcome !== null).length;
  const totalVotes = votes.length;
  const totalYesVotes = votes.filter(v => v.prediction === "yes").length;
  const totalNoVotes = votes.filter(v => v.prediction === "no").length;
  const totalPoolAmount = questions.reduce((total, q) => total + (q.totalPool || 0), 0);
  const totalClaimedAmount = claims.reduce((total, c) => total + (c.amount || 0), 0);
  return <PixelCard className="mb-8 border-[#6c5ce7]">
      <PixelatedText size="xl" className="text-[#6c5ce7] mb-4">Admin Dashboard</PixelatedText>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-[#33e6ff] bg-opacity-20 rounded-lg p-3 border-2 border-[#33e6ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
          <PixelatedText size="md" className="text-[#0a3d62] mb-2">Predictions</PixelatedText>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total</PixelatedText>
              <PixelatedText size="lg" className="text-[#0a3d62]">{totalPredictions}</PixelatedText>
            </div>
            <div>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Active</PixelatedText>
              <PixelatedText size="lg" className="text-[#0a3d62]">{activePredictions}</PixelatedText>
            </div>
            <div>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Resolved</PixelatedText>
              <PixelatedText size="lg" className="text-[#0a3d62]">{resolvedPredictions}</PixelatedText>
            </div>
          </div>
        </div>
        <div className="bg-[#ff69b4] bg-opacity-20 rounded-lg p-3 border-2 border-[#ff69b4] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
          <PixelatedText size="md" className="text-[#0a3d62] mb-2">Votes</PixelatedText>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total</PixelatedText>
              <PixelatedText size="lg" className="text-[#0a3d62]">{totalVotes}</PixelatedText>
            </div>
            <div>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Yes/No</PixelatedText>
              <PixelatedText size="lg" className="text-[#0a3d62]">{totalYesVotes}/{totalNoVotes}</PixelatedText>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#ffde00] bg-opacity-20 rounded-lg p-3 border-2 border-[#ffde00] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
        <PixelatedText size="md" className="text-[#0a3d62] mb-2">Financials</PixelatedText>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total Pool</PixelatedText>
            <PixelatedText size="lg" className="text-[#0a3d62]">{totalPoolAmount.toFixed(3)} SOL</PixelatedText>
          </div>
          <div>
            <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total Claimed</PixelatedText>
            <PixelatedText size="lg" className="text-[#0a3d62]">{totalClaimedAmount.toFixed(3)} SOL</PixelatedText>
          </div>
        </div>
      </div>
    </PixelCard>;
}
function ResolveQuestionModal({
  isOpen,
  onClose,
  onResolve,
  question
}) {
  if (!isOpen || !question) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.8,
      opacity: 0
    }} className="w-full max-w-md">
        <PixelCard className="w-full">
          <div className="flex justify-between items-center mb-4">
            <PixelatedText size="lg" className="text-[#6c5ce7]">Resolve Prediction</PixelatedText>
            <motion.button onClick={onClose} className="text-[#0a3d62] hover:text-[#ff3b30]" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <PixelatedText>✕</PixelatedText>
            </motion.button>
          </div>
          {question.imageUrl && <div className="mb-4">
              <PixelImage src={question.imageUrl} alt={question.title} className="w-full" />
            </div>}
          <div className="mb-6">
            <PixelatedText className="mb-2 text-[#0a3d62]">{question.title}</PixelatedText>
            <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">{question.description}</PixelatedText>
          </div>
          <div className="flex justify-center space-x-4">
            <PixelButton color="green" onClick={() => onResolve(question.id, "yes")}>
              YES
            </PixelButton>
            <PixelButton color="red" onClick={() => onResolve(question.id, "no")}>
              NO
            </PixelButton>
          </div>
        </PixelCard>
      </motion.div>
    </div>;
}
function InfoModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.8,
      opacity: 0
    }} className="w-full max-w-md">
        <PixelCard className="w-full">
          <div className="flex justify-between items-center mb-4">
            <PixelatedText size="lg" className="text-[#6c5ce7]">How It Works</PixelatedText>
            <motion.button onClick={onClose} className="text-[#0a3d62] hover:text-[#ff3b30]" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <PixelatedText>✕</PixelatedText>
            </motion.button>
          </div>
          <div className="space-y-4">
            <div>
              <PixelatedText size="md" className="text-[#ff69b4] mb-2">1. Make a Prediction</PixelatedText>
              <PixelatedText size="sm" className="text-[#0a3d62]">
                Each vote costs 0.001 SOL. Choose YES or NO on any open question.
              </PixelatedText>
            </div>
            <div>
              <PixelatedText size="md" className="text-[#4cd964] mb-2">2. Wait for Resolution</PixelatedText>
              <PixelatedText size="sm" className="text-[#0a3d62]">
                Questions are resolved after their expiration date.
              </PixelatedText>
            </div>
            <div>
              <PixelatedText size="md" className="text-[#ffde00] mb-2">3. Claim Rewards</PixelatedText>
              <PixelatedText size="sm" className="text-[#0a3d62]">
                If you voted correctly, you'll split the pool with other winners.
                95% of the pool goes to winners, 5% to protocol fees.
              </PixelatedText>
            </div>
            <div className="bg-[#33e6ff] bg-opacity-20 border-2 border-[#33e6ff] p-3 rounded-lg mt-4">
              <PixelatedText size="sm" className="text-[#0a3d62]">
                You can only vote ONCE per question. Choose wisely!
              </PixelatedText>
            </div>
          </div>
        </PixelCard>
      </motion.div>
    </div>;
}
function TransactionProgress({
  isVisible
}) {
  if (!isVisible) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] max-w-sm w-full">
        <PixelatedText size="md" className="text-[#0a3d62] mb-4 text-center">
          Processing Transaction
        </PixelatedText>
        <div className="h-6 bg-[#0a3d62] bg-opacity-20 rounded-full overflow-hidden border-2 border-black relative">
          <motion.div className="h-full bg-gradient-to-r from-[#4cd964] via-[#33e6ff] to-[#ff69b4]" initial={{
          width: "0%"
        }} animate={{
          width: ["0%", "30%", "70%", "90%"],
          x: [0, 4, -4, 0]
        }} transition={{
          duration: 2,
          times: [0, 0.3, 0.6, 0.9],
          repeat: Infinity,
          repeatType: "loop"
        }} />
          <div className="absolute inset-0 scanlines opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2].map(i => <motion.div key={i} className="w-2 h-2 bg-white rounded-sm" animate={{
              opacity: [0, 1, 0]
            }} transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3
            }} />)}
            </div>
          </div>
        </div>
        <PixelatedText size="sm" className="text-[#0a3d62] mt-4 text-center opacity-80">
          Please wait while your vote is being processed
        </PixelatedText>
      </div>
    </div>;
}
function ProfilePage({
  userWallet,
  questions,
  allVotes,
  allClaims
}) {
  const [userStats, setUserStats] = useState({
    totalVotes: 0,
    correctVotes: 0,
    incorrectVotes: 0,
    pendingVotes: 0,
    totalEarned: 0,
    voteHistory: []
  });
  useEffect(() => {
    if (!userWallet || !questions.length || !allVotes.length) return;
    const userVotes = allVotes.filter(vote => vote.userId === userWallet);
    const userClaims = allClaims.filter(claim => claim.userId === userWallet);
    const totalEarned = userClaims.reduce((sum, claim) => sum + (claim.amount || 0), 0);
    const voteHistory = userVotes.map(vote => {
      const question = questions.find(q => q.id === vote.questionId);
      let status = 'pending';
      if (question && question.outcome !== null) {
        status = vote.prediction === question.outcome ? 'correct' : 'incorrect';
      }
      return {
        questionId: vote.questionId,
        prediction: vote.prediction,
        status,
        questionTitle: question ? question.title : 'Unknown Question',
        resolvedAt: question ? question.resolvedAt : null,
        claimed: userClaims.some(claim => claim.questionId === vote.questionId)
      };
    });
    const correctVotes = voteHistory.filter(v => v.status === 'correct').length;
    const incorrectVotes = voteHistory.filter(v => v.status === 'incorrect').length;
    const pendingVotes = voteHistory.filter(v => v.status === 'pending').length;
    setUserStats({
      totalVotes: userVotes.length,
      correctVotes,
      incorrectVotes,
      pendingVotes,
      totalEarned,
      voteHistory
    });
  }, [userWallet, questions, allVotes, allClaims]);
  const getStatusColor = status => {
    switch (status) {
      case 'correct':
        return 'text-[#4cd964]';
      case 'incorrect':
        return 'text-[#ff3b30]';
      default:
        return 'text-[#ffde00]';
    }
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'correct':
        return '✓';
      case 'incorrect':
        return '✗';
      default:
        return '?';
    }
  };
  const getVoteColor = vote => {
    return vote === 'yes' ? 'bg-[#4cd964] bg-opacity-20 border-[#4cd964]' : 'bg-[#ff3b30] bg-opacity-20 border-[#ff3b30]';
  };
  const getVoteTextColor = vote => {
    return vote === 'yes' ? 'text-[#4cd964]' : 'text-[#ff3b30]';
  };
  return <div className="max-w-full mx-auto px-[100px]">
      <PixelCard className="mb-8 border-[#ff69b4]">
        <div className="bg-gradient-to-r from-[#ff69b4] via-[#6c5ce7] to-[#3498db] -m-4 mb-4 p-4 border-b-2 border-black">
          <PixelatedText size="xl" className="text-white">User Profile</PixelatedText>
          <PixelatedText size="sm" className="text-white mt-2 break-all">{userWallet}</PixelatedText>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#33e6ff] bg-opacity-20 rounded-lg p-4 border-2 border-[#33e6ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
            <PixelatedText size="md" className="text-[#0a3d62] mb-3">Prediction Stats</PixelatedText>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total Votes</PixelatedText>
                <PixelatedText size="lg" className="text-[#0a3d62]">{userStats.totalVotes}</PixelatedText>
              </div>
              <div>
                <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Correct</PixelatedText>
                <PixelatedText size="lg" className="text-[#4cd964]">{userStats.correctVotes}</PixelatedText>
              </div>
              <div>
                <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Incorrect</PixelatedText>
                <PixelatedText size="lg" className="text-[#ff3b30]">{userStats.incorrectVotes}</PixelatedText>
              </div>
              <div>
                <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Pending</PixelatedText>
                <PixelatedText size="lg" className="text-[#ffde00]">{userStats.pendingVotes}</PixelatedText>
              </div>
            </div>
          </div>
          <div className="bg-[#ffde00] bg-opacity-20 rounded-lg p-4 border-2 border-[#ffde00] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
            <PixelatedText size="md" className="text-[#0a3d62] mb-3">Earnings</PixelatedText>
            <div className="flex flex-col justify-center h-full">
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Total Earned</PixelatedText>
              <PixelatedText size="2xl" className="text-[#0a3d62] mt-2">{userStats.totalEarned.toFixed(4)} SOL</PixelatedText>
              {userStats.correctVotes > 0 && <PixelatedText size="sm" className="text-[#0a3d62] mt-3">
                  Win Rate: {Math.round(userStats.correctVotes / (userStats.correctVotes + userStats.incorrectVotes) * 100)}%
                </PixelatedText>}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <PixelatedText size="lg" className="text-[#6c5ce7] mb-4">Prediction History</PixelatedText>
          {userStats.voteHistory.length === 0 ? <div className="text-center py-8 bg-[#0a3d62] bg-opacity-10 rounded-lg border-2 border-dashed border-[#0a3d62] border-opacity-30">
              <PixelatedText size="md" className="text-[#0a3d62] opacity-70">No predictions yet!</PixelatedText>
              <PixelatedText size="sm" className="text-[#0a3d62] opacity-70 mt-2">
                Make your first prediction to start building your history
              </PixelatedText>
            </div> : <div className="space-y-4">
              {userStats.voteHistory.map((vote, index) => <div key={index} className="border-2 border-[#0a3d62] border-opacity-30 rounded-lg p-3 transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-start mb-2">
                    <PixelatedText size="md" className="text-[#0a3d62] flex-1">{vote.questionTitle}</PixelatedText>
                    <div className={`flex items-center justify-center w-8 h-8 ${getStatusColor(vote.status)} rounded-full border-2 border-black`}>
                      <PixelatedText size="sm">{getStatusIcon(vote.status)}</PixelatedText>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className={`px-3 py-1 rounded-lg border-2 ${getVoteColor(vote.prediction)}`}>
                      <PixelatedText size="sm" className={getVoteTextColor(vote.prediction)}>
                        Voted: {vote.prediction.toUpperCase()}
                      </PixelatedText>
                    </div>
                    {vote.status !== 'pending' && <div className="px-3 py-1 rounded-lg border-2 border-[#0a3d62] border-opacity-30 bg-[#0a3d62] bg-opacity-10">
                        <PixelatedText size="sm" className="text-[#0a3d62]">
                          {vote.status === 'correct' ? 'You won!' : 'You lost'}
                        </PixelatedText>
                      </div>}
                    {vote.claimed && <div className="px-3 py-1 rounded-lg border-2 border-[#ffde00] bg-[#ffde00] bg-opacity-20">
                        <PixelatedText size="sm" className="text-[#0a3d62]">
                          Claimed
                        </PixelatedText>
                      </div>}
                  </div>
                  {vote.resolvedAt && <PixelatedText size="sm" className="text-[#0a3d62] opacity-60 mt-2">
                      Resolved: {new Date(vote.resolvedAt).toLocaleDateString()}
                    </PixelatedText>}
                </div>)}
            </div>}
        </div>
        <div className="mt-8 bg-[#ff69b4] bg-opacity-20 rounded-lg p-4 border-2 border-[#ff69b4]">
          <PixelatedText size="md" className="text-center text-[#0a3d62]">
            Share your predictions on X to compete with friends!
          </PixelatedText>
          <div className="flex justify-center mt-4">
            <PixelButton color="blue" onClick={() => {
            const text = `I've made ${userStats.totalVotes} predictions on YesNoDAO with a ${userStats.correctVotes > 0 ? Math.round(userStats.correctVotes / (userStats.correctVotes + userStats.incorrectVotes) * 100) : 0}% win rate! Join me to predict the future and get paid for it! https://dev.fun/p/27906a144d55a012351a built with @devfunpump`;
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            openLink(url);
          }} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Share Stats on X
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </div>;
}
function App() {
  const {
    devbaseClient,
    userWallet
  } = useDevapp();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [allVotes, setAllVotes] = useState([]);
  const [allClaims, setAllClaims] = useState([]);
  const [currentView, setCurrentView] = useState('main');
  const isAdmin = userWallet === '6SxLVfFovSjR2LAFcJ5wfT6RFjc8GxsscRekGnLq8BMe';
  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(() => {
      fetchQuestions();
    }, 30000);
    return () => clearInterval(interval);
  }, [userWallet, devbaseClient]);
  const fetchQuestions = async () => {
    if (!devbaseClient) return;
    try {
      setLoading(true);
      const fetchedQuestions = await devbaseClient.listEntities("questions");
      const fetchedVotes = await devbaseClient.listEntities("votes");
      const fetchedClaims = await devbaseClient.listEntities("claims");
      setAllVotes(fetchedVotes);
      setAllClaims(fetchedClaims);
      const questionsWithVotes = await Promise.all(fetchedQuestions.map(async question => {
        const votes = fetchedVotes.filter(vote => vote.questionId === question.id);
        const claims = fetchedClaims.filter(claim => claim.questionId === question.id);
        const yesVotes = votes.filter(vote => vote.prediction === "yes").length;
        const noVotes = votes.filter(vote => vote.prediction === "no").length;
        const claimedBy = claims.map(claim => claim.userId);
        const calculatedPool = votes.reduce((total, vote) => total + (vote.amount || 0.001), 0);
        if (question.totalPool !== calculatedPool) {
          if (userWallet === '6SxLVfFovSjR2LAFcJ5wfT6RFjc8GxsscRekGnLq8BMe') {
            try {
              await devbaseClient.updateEntity("questions", question.id, {
                totalPool: calculatedPool
              });
              question.totalPool = calculatedPool;
            } catch (err) {
              console.error("Error updating question pool during fetch:", err);
            }
          } else {
            question.totalPool = calculatedPool;
          }
        }
        return {
          ...question,
          votes,
          yesVotes,
          noVotes,
          claimedBy
        };
      }));
      questionsWithVotes.sort((a, b) => {
        if (a.outcome === null && b.outcome !== null) return -1;
        if (a.outcome !== null && b.outcome === null) return 1;
        if (a.outcome === null) {
          return new Date(b.expiresAt) - new Date(a.expiresAt);
        } else {
          return new Date(b.resolvedAt) - new Date(a.resolvedAt);
        }
      });
      setQuestions(questionsWithVotes);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load prediction questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleVote = async (questionId, prediction) => {
    if (!userWallet) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) {
        alert("Question not found. Please refresh and try again.");
        return;
      }
      const existingVote = question.votes.find(v => v.userId === userWallet);
      if (existingVote) {
        alert("You have already voted on this prediction!");
        return;
      }
      const existingVotes = await devbaseClient.listEntities("votes", {
        questionId,
        userId: userWallet
      });
      if (existingVotes && existingVotes.length > 0) {
        alert("You have already voted on this prediction!");
        await fetchQuestions();
        return;
      }
      const voteAmount = question.voteAmount || 0.001;
      setTransactionInProgress(true);
      await devbaseClient.createEntity("votes", {
        questionId,
        userId: userWallet,
        prediction,
        amount: voteAmount
      });
      const updatedVotes = await devbaseClient.listEntities("votes", {
        questionId,
        userId: userWallet
      });
      if (updatedVotes && updatedVotes.length > 0) {
        try {
          const allVotes = await devbaseClient.listEntities("votes", {
            questionId
          });
          const question = questions.find(q => q.id === questionId);
          const voteAmount = question.voteAmount || 0.001;
          const calculatedPool = allVotes.reduce((total, vote) => total + (vote.amount || voteAmount), 0);
          await devbaseClient.updateEntity("questions", questionId, {
            totalPool: calculatedPool
          });
        } catch (poolError) {
          console.error("Error updating pool total:", poolError);
        }
        setTransactionInProgress(false);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        fetchQuestions();
      } else {
        setTransactionInProgress(false);
        setShowCelebration(false);
        alert("Failed to submit your vote. Please try again.");
      }
    } catch (err) {
      console.error("Error voting:", err);
      try {
        const updatedVotes = await devbaseClient.listEntities("votes", {
          questionId,
          userId: userWallet
        });
        if (updatedVotes && updatedVotes.length > 0) {
          try {
            const allVotes = await devbaseClient.listEntities("votes", {
              questionId
            });
            const question = questions.find(q => q.id === questionId);
            const voteAmount = question.voteAmount || 0.001;
            const calculatedPool = allVotes.reduce((total, vote) => total + (vote.amount || voteAmount), 0);
            await devbaseClient.updateEntity("questions", questionId, {
              totalPool: calculatedPool
            });
          } catch (poolError) {
            console.error("Error updating pool total on retry:", poolError);
          }
          setTransactionInProgress(false);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          fetchQuestions();
        } else {
          setTransactionInProgress(false);
          setShowCelebration(false);
          alert("Failed to submit your vote. Please try again.");
        }
      } catch (checkErr) {
        console.error("Error checking vote status:", checkErr);
        setTransactionInProgress(false);
        setShowCelebration(false);
        alert("Failed to submit your vote. Please try again.");
      }
    }
  };
  const handleClaim = async questionId => {
    if (!userWallet) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      setTransactionInProgress(true);
      console.log("🎮 Starting claim process for question:", questionId);
      const freshQuestion = await devbaseClient.getEntity("questions", questionId);
      if (!freshQuestion) {
        console.error("❌ Question not found:", questionId);
        setTransactionInProgress(false);
        alert("Question not found. Please refresh the page and try again.");
        return;
      }
      if (!freshQuestion.outcome) {
        console.error("❌ Question has no outcome yet:", questionId);
        setTransactionInProgress(false);
        alert("This prediction hasn't been resolved yet. Please wait for the outcome.");
        return;
      }
      const existingClaims = await devbaseClient.listEntities("claims", {
        questionId,
        userId: userWallet
      });
      if (existingClaims && existingClaims.length > 0) {
        console.log("⚠️ User already claimed reward for this question");
        setTransactionInProgress(false);
        alert("You have already claimed your reward for this question!");
        return;
      }
      const allVotes = await devbaseClient.listEntities("votes", {
        questionId
      });
      const correctVotes = allVotes.filter(vote => vote.prediction === freshQuestion.outcome);
      const userCorrectVote = correctVotes.find(vote => vote.userId === userWallet);
      if (userCorrectVote) {
        console.log("✅ User has claimable reward, processing directly:", userCorrectVote);
        const totalCorrectVotes = correctVotes.length;
        let poolAmount = freshQuestion.totalPool || 0;
        if (poolAmount <= 0) {
          poolAmount = allVotes.reduce((total, vote) => total + (vote.amount || 0.001), 0);
        }
        console.log(`💰 Pool: ${poolAmount} SOL, Correct votes: ${totalCorrectVotes}`);
        const poolShare = poolAmount * 0.95 / totalCorrectVotes;
        const finalReward = Math.floor(poolShare * 1000000) / 1000000;
        if (finalReward <= 0 || isNaN(finalReward)) {
          console.error("❌ Invalid reward amount:", finalReward);
          setTransactionInProgress(false);
          alert("Error calculating reward amount. Please try again later.");
          return;
        }
        console.log(`💎 Final reward: ${finalReward} SOL`);
        setShowCelebration(true);
        const claimResult = await devbaseClient.createEntity("claims", {
          questionId,
          amount: finalReward,
          userId: userWallet
        });
        console.log("✅ Claim transaction completed:", claimResult);
        setTransactionInProgress(false);
        setTimeout(() => setShowCelebration(false), 5000);
        await fetchQuestions();
        alert(`🎉 Congratulations! You've claimed ${finalReward.toFixed(4)} SOL!`);
        return;
      }
      const userVotes = await devbaseClient.listEntities("votes", {
        userId: userWallet,
        questionId
      });
      if (!userVotes || userVotes.length === 0) {
        console.log("❌ User did not vote on this prediction");
        setTransactionInProgress(false);
        alert("You did not vote on this prediction.");
        return;
      }
      console.log("❌ User voted incorrectly. User votes:", userVotes, "Outcome:", freshQuestion.outcome);
      setTransactionInProgress(false);
      alert(`You did not vote correctly on this prediction. The outcome was "${freshQuestion.outcome}".`);
    } catch (err) {
      console.error("❌ Error in claim process:", err);
      try {
        const finalCheck = await devbaseClient.listEntities("claims", {
          questionId,
          userId: userWallet
        });
        if (finalCheck && finalCheck.length > 0) {
          console.log("✅ Claim was successful despite error");
          setTransactionInProgress(false);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          await fetchQuestions();
          alert("🎉 Claim successful! Your reward has been processed.");
        } else {
          setTransactionInProgress(false);
          setShowCelebration(false);
          alert("Failed to claim your reward. Please try again.");
        }
      } catch (checkErr) {
        console.error("❌ Error in final verification:", checkErr);
        setTransactionInProgress(false);
        setShowCelebration(false);
        alert("Failed to claim your reward. Please try again.");
      }
    }
  };
  const handleCreatePrediction = async predictionData => {
    try {
      setTransactionInProgress(true);
      await devbaseClient.createEntity("questions", predictionData);
      setShowCreateModal(false);
      setTransactionInProgress(false);
      fetchQuestions();
      alert("Prediction created successfully!");
    } catch (err) {
      setTransactionInProgress(false);
      console.error("Error creating prediction:", err);
      alert("Failed to create prediction. Please try again.");
    }
  };
  const handleResolvePrediction = async (questionId, outcome) => {
    try {
      setTransactionInProgress(true);
      await devbaseClient.updateEntity("questions", questionId, {
        outcome,
        resolvedAt: new Date().toISOString()
      });
      const question = questions.find(q => q.id === questionId);
      if (question && question.totalPool > 0) {
        await devbaseClient.createEntity("protocol_fees", {
          questionId,
          userId: userWallet,
          amount: question.totalPool * 0.05
        });
      }
      setTransactionInProgress(false);
      setShowResolveModal(false);
      setSelectedQuestion(null);
      fetchQuestions();
      alert(`Prediction resolved as ${outcome.toUpperCase()}!`);
    } catch (err) {
      setTransactionInProgress(false);
      console.error("Error resolving prediction:", err);
      alert("Failed to resolve prediction. Please try again.");
    }
  };
  const handleDeletePrediction = async questionId => {
    if (!confirm("Are you sure you want to delete this prediction? This cannot be undone.")) {
      return;
    }
    try {
      setTransactionInProgress(true);
      await devbaseClient.updateEntity("questions", questionId, {
        isDeleted: true,
        title: `[DELETED] ${questions.find(q => q.id === questionId)?.title || ''}`
      });
      setTransactionInProgress(false);
      fetchQuestions();
      alert("Prediction deleted successfully!");
    } catch (err) {
      setTransactionInProgress(false);
      console.error("Error deleting prediction:", err);
      alert("Failed to delete prediction. Please try again.");
    }
  };
  const openResolveModal = question => {
    setSelectedQuestion(question);
    setShowResolveModal(true);
  };
  const filteredQuestions = questions.filter(q => {
    if (q.isDeleted) return false;
    const isExpired = new Date(q.expiresAt) < new Date();
    const isResolved = q.outcome !== null;
    if (activeTab === "active") {
      return !isExpired || isExpired && !isResolved;
    } else {
      return isResolved;
    }
  });
  const expiredUnresolvedQuestions = isAdmin ? questions.filter(q => {
    const isExpired = new Date(q.expiresAt) < new Date();
    return isExpired && q.outcome === null;
  }) : [];
  return <div className="min-h-screen bg-gradient-to-b from-[#3498db] to-[#6c5ce7] pb-20 relative overflow-visible">
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20"></div>
      {showCelebration && <Confetti />}
      {showCreateModal && <CreatePredictionModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePrediction} />}
      {showResolveModal && <ResolveQuestionModal isOpen={showResolveModal} onClose={() => setShowResolveModal(false)} onResolve={handleResolvePrediction} question={selectedQuestion} />}
      {showInfoModal && <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />}
      {transactionInProgress && <TransactionProgress isVisible={transactionInProgress} />}
      <header className="bg-gradient-to-r from-[#6c5ce7] via-[#ff69b4] to-[#3498db] py-4 sm:py-6 px-[100px] mb-6 sm:mb-8 shadow-lg border-b-2 border-black relative overflow-visible">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptMC04YzEuMTA1IDAgMiAuODk1IDIgMnMtLjg5NSAyLTIgMi0yLS44OTUtMi0yIC44OTUtMiAyLTJ6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="mb-4 md:mb-0 cursor-pointer" onClick={() => currentView === 'profile' ? setCurrentView('main') : null}>
            <motion.h1 initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="text-2xl sm:text-4xl md:text-5xl text-white font-bold pixel-text transform -rotate-2 text-shadow-[0_2px_0_#000]">
              YesNoDAO
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-white text-sm sm:text-lg mt-1 sm:mt-2 pixel-text text-shadow-[0_1px_0_#000]">
              PREDICT THE FUTURE. GET PAID FOR IT.
            </motion.p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {userWallet && <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <PixelButton color="purple" onClick={() => setCurrentView(currentView === 'main' ? 'profile' : 'main')} className="relative overflow-hidden">
                  <span className="relative z-10">{currentView === 'main' ? 'My Profile' : 'Home'}</span>
                  <motion.div className="absolute inset-0 opacity-30" animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                backgroundSize: ['100% 100%', '200% 200%']
              }} transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5
              }} style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
              }} />
                </PixelButton>
              </motion.div>}
            {isAdmin && <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <PixelButton color="yellow" onClick={() => setShowCreateModal(true)} className="relative overflow-hidden">
                  <span className="relative z-10">Create Prediction</span>
                  <motion.div className="absolute inset-0 opacity-30" animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                backgroundSize: ['100% 100%', '200% 200%']
              }} transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5
              }} style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
              }} />
                </PixelButton>
              </motion.div>}
            <motion.button onClick={() => setShowInfoModal(true)} className="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:bg-[#33e6ff] transition-colors" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} aria-label="How it works">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a3d62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </motion.button>
            <div className="relative z-[100] mt-1 mb-2 md:mt-0 md:mb-0">
              <UserButton className="bg-[#6c5ce7] px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-full mx-auto px-[100px]">
        {currentView === 'profile' && userWallet ? <ProfilePage userWallet={userWallet} questions={questions} allVotes={allVotes} allClaims={allClaims} /> : <>
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white rounded-full p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] flex">
                <motion.button className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full transition-all ${activeTab === "active" ? "bg-[#ff69b4] text-white" : "text-[#0a3d62]"}`} onClick={() => setActiveTab("active")} whileHover={{
              scale: activeTab !== "active" ? 1.05 : 1
            }} whileTap={{
              scale: 0.95
            }}>
                  <PixelatedText size="sm">Active</PixelatedText>
                </motion.button>
                <motion.button className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full transition-all ${activeTab === "resolved" ? "bg-[#6c5ce7] text-white" : "text-[#0a3d62]"}`} onClick={() => setActiveTab("resolved")} whileHover={{
              scale: activeTab !== "resolved" ? 1.05 : 1
            }} whileTap={{
              scale: 0.95
            }}>
                  <PixelatedText size="sm">Resolved</PixelatedText>
                </motion.button>
              </div>
            </div>
        {isAdmin && <AdminMetricsCard questions={questions} votes={allVotes} claims={allClaims} />}
        {isAdmin && expiredUnresolvedQuestions.length > 0 && <div className="mb-8">
            <PixelCard className="border-[#ffde00]">
              <PixelatedText size="lg" className="text-[#0a3d62] mb-4">Admin Controls: Resolve Predictions</PixelatedText>
              <div className="space-y-4">
                {expiredUnresolvedQuestions.map(question => <div key={question.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-[#33e6ff] pb-3 gap-3">
                    <div>
                      <PixelatedText size="md" className="text-[#0a3d62]">{question.title}</PixelatedText>
                      <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Expired: {new Date(question.expiresAt).toLocaleString()}</PixelatedText>
                    </div>
                    <PixelButton color="purple" onClick={() => openResolveModal(question)}>
                      Resolve
                    </PixelButton>
                  </div>)}
              </div>
            </PixelCard>
          </div>}
            {isAdmin && expiredUnresolvedQuestions.length > 0 && <div className="mb-8">
                <PixelCard className="border-[#ffde00]">
                  <PixelatedText size="lg" className="text-[#0a3d62] mb-4">Admin Controls: Resolve Predictions</PixelatedText>
                  <div className="space-y-4">
                    {expiredUnresolvedQuestions.map(question => <div key={question.id} className="flex justify-between items-center border-b-2 border-[#33e6ff] pb-3">
                        <div>
                          <PixelatedText size="md" className="text-[#0a3d62]">{question.title}</PixelatedText>
                          <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">Expired: {new Date(question.expiresAt).toLocaleString()}</PixelatedText>
                        </div>
                        <PixelButton color="purple" onClick={() => openResolveModal(question)}>
                          Resolve
                        </PixelButton>
                      </div>)}
                  </div>
                </PixelCard>
              </div>}
            {isAdmin && activeTab === "resolved" && <div className="mb-8">
                <PixelCard className="border-[#ff3b30]">
                  <PixelatedText size="lg" className="text-[#0a3d62] mb-4">Admin Controls: Delete Resolved Predictions</PixelatedText>
                  <div className="space-y-4">
                    {questions.filter(q => q.outcome !== null).map(question => <div key={question.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-[#ff3b30] border-opacity-30 pb-3 gap-3">
                        <div className="flex-1">
                          <PixelatedText size="md" className="text-[#0a3d62] break-words">{question.title}</PixelatedText>
                          <PixelatedText size="sm" className="text-[#0a3d62] opacity-80">
                            Resolved: {question.resolvedAt ? new Date(question.resolvedAt).toLocaleString() : 'Unknown'} - 
                            Outcome: <span className={question.outcome === "yes" ? "text-[#4cd964]" : "text-[#ff3b30]"}>
                              {question.outcome?.toUpperCase()}
                            </span>
                          </PixelatedText>
                        </div>
                        <PixelButton color="red" onClick={() => handleDeletePrediction(question.id)}>
                          Delete
                        </PixelButton>
                      </div>)}
                  </div>
                </PixelCard>
              </div>}
            {loading ? <div className="text-center py-10">
                <div className="inline-block animate-bounce mx-1 w-4 h-4 bg-[#6c5ce7] rounded-full"></div>
                <div className="inline-block animate-bounce mx-1 w-4 h-4 bg-[#ff69b4] rounded-full" style={{
            animationDelay: "0.2s"
          }}></div>
                <div className="inline-block animate-bounce mx-1 w-4 h-4 bg-[#33e6ff] rounded-full" style={{
            animationDelay: "0.4s"
          }}></div>
                <PixelatedText className="mt-4 text-white">Loading predictions...</PixelatedText>
              </div> : error ? <div className="text-center py-10">
                <PixelatedText className="text-[#ff3b30]">{error}</PixelatedText>
              </div> : filteredQuestions.length === 0 ? <div className="text-center py-10">
                <PixelatedText className="text-white">
                  {activeTab === "active" ? "No active predictions right now. Check back soon!" : "No resolved predictions yet."}
                </PixelatedText>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredQuestions.map(question => <QuestionCard key={question.id} question={question} onVote={handleVote} onClaim={handleClaim} userWallet={userWallet} />)}
              </div>}
          </>}
      </main>
      <footer className="w-full pt-10 pb-6 relative">
        <div className="max-w-full mx-auto px-[100px] flex justify-center">
          <a href="https://x.com/yesnodao" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:bg-[#ffde00] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a3d62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>
      </footer>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        :root {
          --primary-blue: #3498db;
          --secondary-cyan: #33e6ff;
          --accent-yellow: #ffde00;
          --action-pink: #ff69b4;
          --battle-green: #4cd964;
          --text-dark-blue: #0a3d62;
          --live-red: #ff3b30;
          --wallet-purple: #6c5ce7;
          --pixel-shadow: 3px 3px 0 rgba(0,0,0,0.8);
          --pixel-border: 2px solid #000;
        }
        body {
          overflow-x: hidden;
          position: relative;
        }
        /* Fix for wallet dropdown */
        .wallet-adapter-dropdown {
          position: relative;
          z-index: 9999;
        }
        .wallet-adapter-dropdown-list {
          position: absolute;
          z-index: 9999;
          transform: translateY(10px);
          min-width: 200px;
        }
        .font-pixel {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .font-button {
          font-family: 'VT323', monospace;
        }
        .font-body {
          font-family: 'Courier New', monospace;
        }
        .pixel-text {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.4;
        }
        button {
          image-rendering: pixelated;
          transition: all 0.1s;
        }
        .text-shadow-\[0_2px_0_\#000\] {
          text-shadow: 0 2px 0 #000;
        }
        .text-shadow-\[0_1px_0_\#000\] {
          text-shadow: 0 1px 0 #000;
        }
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
        }
      `}</style>
    </div>;
}
